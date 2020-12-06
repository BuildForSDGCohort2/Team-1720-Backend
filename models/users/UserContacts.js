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
     contacts: [{
         contact: [{
             mtb_id: {
                 type: String,
                 trim: true
             },
             mtb_user_relationship: {
                 type: String,
                 trim: true
             },
             permission: [{
                 basic_information: {
                     type: String,
                     trim: true
                 },
                 medical_history: {
                     type: String,
                     trim: true
                 },
                 medical_allergies: {
                     type: String,
                     trim: true
                 }
             }]
         }],
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