import {writeFileSync, readFileSync, existsSync} from 'fs'
const fn = './build/.annoyingtipsshowcount';
export function getAnnoyingTipCounter(){
    
    if (!existsSync(fn)){
        let file = {
            versionIncrement: 0, 
            distHeader: 0, 
            cliBundling: 0
        }
        writeFileSync(fn, JSON.stringify(file)); return file;
    }
    else return JSON.parse(readFileSync(fn, 'utf-8'));
}
export function incrementAnnoyingTipCount(c, key, val){
    c[key]=c[key]+val;

    writeFileSync(fn, JSON.stringify(c)); return c;
}