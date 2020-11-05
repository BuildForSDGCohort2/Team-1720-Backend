'use strict';

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cryptoRandomString = require('crypto-random-string')


const userConfirmationSchema = mongoose.Schema({
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

userConfirmationSchema.statics.findUserConfirmationTempByRefLink = async(userRef) => {

    // Search for a user by email and password.
    const user = await UserConfirmation.findOne({
        user_temp_ref: userRef
    })

    if (!user) {
        throw new Error({
            error: 'Invalid login credentials'
        })
    }

    return user
}



const UserConfirmation = mongoose.model(process.env.DB_PREFIX + 'User_Confirmation', userConfirmationSchema)

module.exports = UserConfirmation