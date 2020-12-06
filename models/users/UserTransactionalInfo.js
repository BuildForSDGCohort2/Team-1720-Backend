 const mongoose = require('mongoose')
 const validator = require('validator')
 const bcrypt = require('bcryptjs')
 const jwt = require('jsonwebtoken')
 const cryptoRandomString = require('crypto-random-string')

 const userTransactionalInfoSchema = mongoose.Schema({
     mtb_id: {
         type: String,
         required: true,
         trim: true
     },
     medical_aid: [{
         medical_aid_name: {
             type: String,
             trim: true
         },
         medical_aid_user_name: {
             type: String,
             trim: true
         },
         medical_aid_number: {
             type: String,
             trim: true
         },
         medical_aid_registration_date: {
             type: String,
             trim: true
         },
         medical_aid_code: {
             type: String,
             trim: true
         },
     }],
     banking_info: [{
         bank_name: {
             type: String,
             trim: true
         },
         account_number: {
             type: String,
             trim: true
         },
         name_on_account: {
             type: String,
             trim: true
         },
         branch_code: {
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