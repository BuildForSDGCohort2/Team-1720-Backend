"use strict";

const jwt = require('jsonwebtoken')
const cryptoRandomString = require('crypto-random-string')

module.exports = {
    resetHashLink(user_id) {
        const updatedSerial = cryptoRandomString({
            length: 120
        });

        const resToken = jwt.sign({
            _id: user_id
        }, process.env.JWT_KEY, {
            expiresIn: 60 * 60
        }) + updatedSerial

        return {
            token: resToken,
            extras: updatedSerial
        };
    },
    resetRefHash() {
        const updatedSerial = cryptoRandomString({
            length: 10
        });
        const date = new Date();
        const year = date.getUTCFullYear();
        const month = date.getUTCDate();
        const day = date.getUTCDay();
        const utc = Date.UTC(year, month, day);

        const resUserRefToken = updatedSerial + utc;

        return resUserRefToken;
    },
    confirmationHashLink(user_id) {
        const updatedSerial = cryptoRandomString({
            length: 110,
            type: 'url-safe'
        });

        const resToken = jwt.sign({
            _id: user_id
        }, process.env.JWT_KEY, {
            expiresIn: 60 * 60
        }) + updatedSerial

        return {
            token: resToken,
            extras: updatedSerial
        };
    },
    confirmationHashLinkRef() {
        const updatedSerial = cryptoRandomString({
            length: 40,
            type: 'url-safe'
        });

        const curDate = Date.now();
        const tempAccRef = updatedSerial + "-" + curDate;

        return tempAccRef;
    },
    userNotFoundHashLinkRef() {
        const updatedSerial = cryptoRandomString({
            length: 70,
            type: 'distinguishable'
        });

        const curDate = Date.now();
        const tempAccRef = updatedSerial + curDate;

        return tempAccRef;
    }
}