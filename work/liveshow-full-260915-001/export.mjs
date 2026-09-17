import {registerHooks} from 'node:module';
// Resolve the shared builder's spreadsheet dependency from the bundled runtime link.
registerHooks({resolve(specifier,context,nextResolve){
 return nextResolve(specifier,specifier==='@oai/artifact-tool'?{...context,parentURL:import.meta.url}:context);
}});
await import('../../scripts/build-testcase-workbook.mjs');
