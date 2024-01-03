import { buildCliExtensions } from "./buildCliExtensions.js";
import {resolve} from 'path';
import {TsconfigPathsPlugin} from '@esbuild-plugins/tsconfig-paths'
import * as esbuild from 'esbuild';
import { getCurrentVariables } from "./currentVariables.js";
import {writeFile, readFile} from 'fs/promises';
import {existsSync} from 'fs';
import { getAnnoyingTipCounter, incrementAnnoyingTipCount } from "./tip.js";

function createLog(mod){
    function log(data, color, type){
        if (data.toString().endsWith('\n'))
            data = (data.toString()).slice(0, -1);

        let l; 
        if (type.includes('error')) l = console.error;
        else if (type.includes('warning')) l = console.warn;
        else l = console.log;
        l(
            `${color}\x1b[2m${new Date().toLocaleString()}\x1b[0m\x1b[0m`+
            `${color} ${mod}:  \x1b[0m`
            +` ${data}`);
    }
    return {
        log: (data) => log(data, '', 'info   '),
        err: (data) => log(data, '\x1b[30m', 'error  '),
        warn: (data) => log(data, '\x1b[33m', 'warning'),
        su: (data) => log(data, '\x1b[32m', 'success')
    }
  }
  const {log, err, warn, su} = createLog('build');



async function run(){
    const packageJson = JSON.parse(await readFile('./package.json', 'utf-8'));
    let {version, main} = packageJson;

    /* [!!!] Uncomment here to increment 
       patch version value every build

    
    let newMainVersion = `${version.split('.').slice(0,2).join('.')}.${Number(version.split('.').pop())+1}`;
    await writeFile('./package.json', JSON.stringify({
        ...packageJson, version: newMainVersion
    }, null, 2));
    
    */
    let annoy = getAnnoyingTipCounter();

    if (annoy.cliBundling < 1){
        su(`every file that matches *.cli.ts is imported into "src/extensions/cli.ts"
                              you can import the entire file and pass yargs instance to function that it exports. 
                              that way you get a nice file structure
        `);
        incrementAnnoyingTipCount(annoy, 'distHeader', 1);
    }
    if (annoy.versionIncrement <= 2){
        su(`you can increment a patch version in package.json 
                              on every build (patch version is number - 1.0.*)
                              uncomment some code in "build/index.js" to enable this
        `);
        incrementAnnoyingTipCount(annoy, 'versionIncrement', 1);
    }

    let cliConfigureResult = await buildCliExtensions(resolve('./src/'), true);


    let esbuildTime = Date.now();

    try{
        await esbuild.build({
            entryPoints: [resolve('./src/index.ts')],
            bundle: true,
            plugins: [TsconfigPathsPlugin({absolute: true, tsconfig: './tsconfig.json'})],
            platform: 'node',
            packages: 'external',
            format: 'esm',
            sourcemap: true,
            outfile: resolve(main),
        });

        su(`esbuild finished in ${Date.now()-esbuildTime} ms\n`)
    }
    catch(e){
        err('esbuild failed');
        return;
    }




    if (existsSync('./build/distHeader.txt')){
        let header = await readFile('./build/distHeader.txt', 'utf-8');
        let vars = getCurrentVariables();
        
        for(let [key, val] of Object.entries(vars)){
            header = header.replaceAll(`{${key}}`, val);
        }

        await writeFile(resolve(main), 
        header + '\n' + (await readFile(resolve(main), 'utf-8')));

        if (annoy.distHeader <= 1){
            su(`content from "build/distHeader.txt" is appended to the start of outfile every time.
                              suggestion: modify it for your own purposes, or delete it so it won't be writed anymore
                              `);
            incrementAnnoyingTipCount(annoy, 'distHeader', 1);
        }
    }
    
}
run().catch(err);