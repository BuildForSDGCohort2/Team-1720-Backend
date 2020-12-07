const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cryptoRandomString = require('crypto-random-string')

const userAddressSchema = mongoose.Schema({
    mtb_id: {
        type: String,
        required: true,
        trim: true
    },
    home_address: [{
        street_address: {
            type: String,
            trim: true
        },
        suburb: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        province: {
            type: String,
            trim: true
        },
        zip_code: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        }
    }],
    work_address: [{
        street_address: {
            type: String,
            trim: true
        },
        suburb: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        province: {
            type: String,
            trim: true
        },
        zip_code: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        }
    }],
    last_updated: [{
        token: {
            type: String,
            required: true
        },
        browser: {
            type: String,
        },
        ip_location: {
            type: String
        },
        last_loggedIn: {
            type: String
        }
    }]
});