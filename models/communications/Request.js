const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cryptoRandomString = require('crypto-random-string')

const userRequestSchema = mongoose.Schema({
    mtb_id: {
        type: String,
        required: true,
        trim: true
    },
    doctor_id: {
        type: String,
        required: true
    },
    date_of_request: [{
        date: {
            type: String,
            required: true
        },
        browser: {
            type: String,
        },
        ip_location: {
            type: String
        }
    }],
    chat_end: [{
        chat_has_ended: {
            type: Boolean,
            trim: true
        },
        chat_end_date: {
            type: Date,
            trim: true
        },
        reason_for_chat_end: {
            type: String,
            trim: true
        },
        chat_end_consultation_date: {
            type: Date,
            trim: true
        },
        chat_end_referral_doctor_id: {
            type: String,
            trim: true
        },
    }],
    doctor_notes: {
        type: String,
        required: true
    },
    prescriptions: [{
        chat_has_prescriptions: {
            type: Boolean
        },
        prescription_data: {
            type: Array
        },
        prescription_doctor_id: {
            type: String
        },
    }],
    amounts: [{
        initial_amount: {
            type: String,
            trim: true
        },
        other_amounts: {
            type: Array,
            trim: true
        },
        total_amount: {
            type: String,
            trim: true
        },
        amount_due: {
            type: String,
            trim: true
        },
        amount_paid: {
            type: String,
            trim: true
        },
        has_outstanding_amount: {
            type: Boolean,
            trim: true
        },
        outstanding_amount: {
            type: String,
            trim: true
        }
    }],
    patient_legal: [{
        terms_and_conditions: {
            type: Boolean
        },
        payment_settlement_agreement: {
            type: Boolean
        }
    }],
    doctor_legal: [{
        terms_and_conditions: {
            type: Boolean
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