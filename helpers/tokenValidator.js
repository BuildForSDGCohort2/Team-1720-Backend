'use strict';

const jwt = require('jsonwebtoken')

const date = new Date();
const year = date.getUTCFullYear();
const month = date.getUTCDate();
const day = date.getUTCDay();
const hours = date.getUTCHours();
const mins = date.getUTCMinutes();


module.exports = {
    async isTokenExpired(token, extras) {
        const fullToken = token.replace(extras, '');

        try {

            const decoded = jwt.verify(fullToken, process.env.JWT_KEY);

            // Token is not valid
            if (Date.now() >= decoded.exp * 1000) {
                return false;
            }

            // Token Id is found
            if (decoded._id.length > 0) {
                return decoded._id;
            }

            return false;

        } catch (err) {

            return "Token expired";
        }

    },
    getUTCOffset(timeInHours) {
        const utc_exp = Date.UTC(year, month, day, (hours + 1), mins);
        return utc_exp;
    }
}