"""Parse source HTML without executing prototype code. JSON in, JSON out."""
import json
import re
import sys
from html.parser import HTMLParser


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.text = text
        self.nodes = []
        self.stack = []
        self.scripts = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        node = {"tag": tag, "attrs": dict(attrs), "line": self.getpos()[0],
                "parent": self.stack[-1] if self.stack else None, "text": "",
                "raw": self.get_starttag_text()}
        index = len(self.nodes)
        self.nodes.append(node)
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}:
            self.stack.append(index)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if self.stack and self.nodes[self.stack[-1]]["tag"] == tag:
            self.stack.pop()

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.nodes[self.stack[index]]["tag"] == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self, data):
        if any(self.nodes[i]["tag"] in {"script", "style"} for i in self.stack):
            if self.stack and self.nodes[self.stack[-1]]["tag"] == "script":
                self.scripts.append({"text": data, "line": self.getpos()[0]})
            return
        for i in self.stack:
            self.nodes[i]["text"] += data

    def controls(self):
        result = []
        for index, node in enumerate(self.nodes):
            attrs = node["attrs"]
            if node["tag"] not in {"button", "input", "select", "textarea", "a"} and not ("onclick" in attrs or attrs.get("role") == "button"):
                continue
            name = attrs.get("aria-label") or re.sub(r"\s+", " ", node["text"]).strip() or attrs.get("placeholder") or attrs.get("name") or attrs.get("id")
            if not name:
                continue
            ancestors = []
            p = node["parent"]
            while p is not None:
                a = self.nodes[p]
                if a["attrs"].get("id") or a["attrs"].get("role") == "dialog":
                    ancestors.append({"id": a["attrs"].get("id", ""), "role": a["attrs"].get("role", "")})
                p = a["parent"]
            result.append({"index": index, "tag": node["tag"], "attrs": attrs,
                           "line": node["line"], "name": name, "ancestors": ancestors, "raw": node["raw"]})
        return result


def parse(text):
    document = Document(text)
    controls = [{**c, "origin": "html"} for c in document.controls()]
    # Template markup is separately identified, never confused with rendered DOM.
    # ponytail: interpolation stays symbolic; runtime-only branches need DOM evidence.
    for script in document.scripts:
        for match in re.finditer(r"`((?:\\.|[^`\\])*)`", script["text"], re.S):
            if not re.search(r"<(button|input|select|textarea|a)\b", match[1]):
                continue
            fragment = Document(match[1])
            for c in fragment.controls():
                controls.append({**c, "line": script["line"] + script["text"][:match.start()].count("\n") + c["line"] - 1,
                                 "origin": "template", "templateOffset": match.start()})
    return controls


if __name__ == "__main__":
    data = json.load(sys.stdin)
    json.dump({name: parse(text) for name, text in data.items()}, sys.stdout, ensure_ascii=False)
