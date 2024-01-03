import {searchForExtFiles} from './searchForExtFiles.js';
import {writeFile, mkdir} from 'fs/promises';
import {existsSync} from 'fs';
import {resolve} from 'path';

export async function buildCliExtensions(dir, create){
    let {routes, imports} = await searchForExtFiles(dir, '.cli.ts');
    // if (routes.length == 0) console.log('no cli extensions for '+dir);

    let cliExtension = 
`
${imports}
import { Argv } from "yargs";
const _ = ()=>{};

/**
 * Every CLI extension (*.cli.ts) of this module exported into single function.
 * Generated ${new Date().toString('en-US')}
 */
export default async function (y:Argv){
  ${routes.map(e=>`await ${e.routename}(y);`).join('\n\t')}
  return y;
}`;

  if (create){
    let extDir = resolve(dir, 'extensions');
    if (!existsSync(extDir)) await mkdir(extDir, {recursive: true});

    await writeFile(resolve(dir, 'extensions/cli.ts'), cliExtension);
  }
  return cliExtension;
}