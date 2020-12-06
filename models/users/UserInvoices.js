 const mongoose = require('mongoose')
 const validator = require('validator')
 const bcrypt = require('bcryptjs')
 const jwt = require('jsonwebtoken')
 const cryptoRandomString = require('crypto-random-string')

 const userContactSchema = mongoose.Schema({
     mtb_id: {
         type: String,
         required: true,
         trim: true
     },
     invoices: [{
         invoice_id: {
             type: String
         },
         request_id: {
             type: String
         },
         doctor_ids: {
             type: Array
         },
         chat_id: {
             type: String
         },
         amount_due: {
             type: String,
         },
         amount_paid: {
             type: String
         },
         amount_outstanding: {
             type: String
         },
         amount_payment_confirmed: {
             type: String
         },
         payment_confirmation_ref: {
             type: String
         },
         requested_completed: {
             type: Date
         },
         method_of_payment: {
             type: String
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