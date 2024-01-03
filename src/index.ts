import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import extensions from './extensions/cli';
(async ()=>{
    let y = yargs(hideBin(process.argv));

    
    await extensions(y);
    y.command('hello', 'Hello?', ()=>{}, args=>{
        console.log("Hello World!");
    });


    await y.parseAsync();
})()