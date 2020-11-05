'use strict';


const date = new Date();
const year = date.getUTCFullYear();
const month = date.getUTCDate();
const day = date.getUTCDay();
const hours = date.getUTCHours();
const mins = date.getUTCMinutes();


module.exports = {
    getUTCNow() {
        const utc = Date.UTC(year, month, day, hours, mins);
        return utc;
    },
    getUTCOffset(timeInHours) {
        const utc_exp = Date.UTC(year, month, day, (hours + 1), mins);
        return utc_exp;
    }
}