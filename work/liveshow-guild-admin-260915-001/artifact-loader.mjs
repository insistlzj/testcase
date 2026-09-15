import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
export async function resolve(specifier,context,nextResolve){
 return nextResolve(specifier==='@oai/artifact-tool'?require.resolve(specifier):specifier,context);
}
