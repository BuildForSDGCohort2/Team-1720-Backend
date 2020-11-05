'use strict';

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cryptoRandomString = require('crypto-random-string')


const userResetSchema = mongoose.Schema({
    user_temp_ref: {
        type: String
    },
    user_id: {
        type: String
    },
    time_added: {
        type: String
    },
    expire: {
        type: String
    },
    status: {
        type: String
    },
    ip_location: {
        type: Object
    },
    email_address_to: {
        type: String
    },
    token: {
        type: String,
        required: true
    },
    extra_val: {
        type: String
    }

})

userResetSchema.statics.findUserResetByRefLink = async(userRef) => {
    // Search for a user by email and password.
    const user = await UserReset.findOne({
        user_temp_ref: userRef
    })

    if (!user) {
        throw new Error({
            error: 'Invalid login credentials'
        })
    }

    return user
}


userResetSchema.statics.deactivateToken = async(userRef) => {

    // Update the token for the user.
    const updatingVals = {
        expire: "0000000000000000000",
        status: "used",
        time_added: Date.now()
    }

    const updateToken = await UserReset.updateMany({ user_temp_ref: userRef }, updatingVals);

    if (!updateToken) {
        return updateToken;
    }

    return updateToken;

}

const UserReset = mongoose.model(process.env.DB_PREFIX + 'User_Reset', userResetSchema)

module.exports = UserReset