'use strict';
const UserReset = require('../models/users/UserReset');

module.exports = {
    async generateResetUser(ref, user_id) {
        const date = new Date();
        const year = date.getUTCFullYear();
        const month = date.getUTCDate();
        const day = date.getUTCDay();
        const hours = date.getUTCHours();
        const mins = date.getUTCMinutes();
        const utc = Date.UTC(year, month, day, hours, mins);
        const utc_exp = Date.UTC(year, month, day, (hours + 1), mins);

        // Create the reset password table.
        const userResetProfile = new UserReset({
            user_temp_ref: ref,
            user_id: user_id,
            time_added: utc,
            expire: utc_exp,
            status: "initiated"
        })
        await userResetProfile.save((error, user) => {
            if (error) {
                console.log('Error');
                return error;
            }

            // console.log(user);
            return "Function reset User was found......";
            // return user;
        });

        // return "Function reset User was found......";
    }
}