import {readdir} from 'fs/promises';
import {resolve} from 'path';

async function* getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        yield* getFiles(res);
      } else {
        yield res;
      }
    }
}

const routename = (r) => {
  let rsplit = r.split(/\\|\//gm).filter(e=>e.length);
  
  return rsplit.join('____').replaceAll('C:','').replaceAll('.','__').replaceAll('__ts','').replaceAll('__js','').replaceAll(' ', "_").replaceAll('-','_');
}

function removeTsExtension(r){
  if (r.endsWith('.ts')) return r.slice(0, -3);
  return r;
}

export async function searchForExtFiles(dir, ext) {
    const files = [];
    for await (const f of getFiles(dir)) {
      if (f.includes('node_modules')) continue;
        if(f.endsWith(ext)) {
            files.push(f);
        }
    }
    let routenameToImport = files.map(e=>{
      return {
        routename: routename(e),
        path: e
      }
    });
    let imports = routenameToImport.map(e=>{
      return `import ${e.routename} from '${removeTsExtension(e.path.replaceAll('\\', '\\\\'))}';`
    }).join('\n');
    return {routes: routenameToImport, imports}
}