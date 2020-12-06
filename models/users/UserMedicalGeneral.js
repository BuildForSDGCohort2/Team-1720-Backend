const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cryptoRandomString = require('crypto-random-string')

const userMedicalGeneralSchema = mongoose.Schema({
    mtb_id: {
        type: String,
        required: true,
        trim: true
    },
    medical_allergies: {
        type: Array,
        trim: true
    },
    medical_vaccines: {
        type: Array,
        trim: true
    },
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