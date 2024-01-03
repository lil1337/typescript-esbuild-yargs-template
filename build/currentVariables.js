import { hostname, userInfo } from 'os';
import {readFileSync} from 'fs';
export function getCurrentVariables(){

    let {name, version, description, author, license} = JSON.parse(readFileSync('./package.json', 'utf-8'));


    let d = new Date();
    let dateTime = d.toLocaleString();
    let date = d.toLocaleDateString();
    let time = d.toLocaleTimeString();
    let day = d.getDate();
    let month = d.getMonth()+1;
    let monthName = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"][d.getMonth()];
    let year = d.getFullYear();
    let second = d.getSeconds();
    let millisecond = d.getMilliseconds();
    let unixTimestamp = d.getTime();
    let username = userInfo().username;

    return {
        name, version, description, author, license,
        dateTime, date, time, day, month, monthName, year, second, millisecond, unixTimestamp, username, hostname: hostname()
    }
}