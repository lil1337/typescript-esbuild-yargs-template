import { Argv } from "yargs";

export default async function(y: Argv){
    y.command('test', "Test", y=>{
        y.command("asdf", "Test asdf", ()=>{}, args=>{
            console.log("test");
            console.log("asdf");
        });

        y.command('qwerty', "Test qwerty", ()=>{}, args=>{
            console.log("test");
            console.log('qwerty');
        })
    }, ()=>console.error('error: use "test asdf" or "test qwerty"'));
}