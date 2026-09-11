import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { expandEvidenceDependencies } from "./evidence-dependencies.mjs";

test("证据依赖从入口递归展开，但不纳入无关文件", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "evidence-dependencies-"));
  try {
    await fs.mkdir(path.join(directory, "pages"));
    await fs.mkdir(path.join(directory, "assets"));
    await fs.writeFile(path.join(directory, "pages/live.html"), '<script src="../assets/live.js"></script>');
    await fs.writeFile(path.join(directory, "assets/live.js"), 'location.href = "../pages/result.html";');
    await fs.writeFile(path.join(directory, "pages/result.html"), "<main>result</main>");
    await fs.writeFile(path.join(directory, "pages/unrelated.html"), "<main>skip</main>");
    const result = await expandEvidenceDependencies(directory, [path.join(directory, "pages/live.html")]);
    assert.deepEqual(result.语义文件, ["assets/live.js", "pages/live.html", "pages/result.html"]);
    assert.ok(!result.语义文件.includes("pages/unrelated.html"));
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('共享脚本的页面跳转按宿主HTML位置解析，不按assets目录解析',async()=>{
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'evidence-navigation-'));
  try{
    await fs.mkdir(path.join(directory,'pages'));await fs.mkdir(path.join(directory,'assets'));
    await fs.writeFile(path.join(directory,'pages/live.html'),'<script src="../assets/common.js"></script>');
    await fs.writeFile(path.join(directory,'assets/common.js'),'location.href = "result.html";');
    await fs.writeFile(path.join(directory,'pages/result.html'),'<main>result</main>');
    const found=await expandEvidenceDependencies(directory,[path.join(directory,'pages/live.html')]);
    assert.ok(found.语义文件.includes('pages/result.html'));
    assert.ok(found.依赖关系.some(e=>e.目标==='pages/result.html'&&e.页面上下文==='pages/live.html'));
  }finally{await fs.rm(directory,{recursive:true,force:true});}
});
