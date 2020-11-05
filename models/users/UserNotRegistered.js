'use strict';

const mongoose = require('mongoose')

const userNotFoundSchema = mongoose.Schema({
    user_temp_ref: {
        type: String
    },
    time_added: {
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
    }
});

const UserNotFound = mongoose.model(process.env.DB_PREFIX + 'Users_NotRegistered', userNotFoundSchema)

module.exports = UserNotFound