 const mongoose = require('mongoose')
 const validator = require('validator')
 const bcrypt = require('bcryptjs')
 const jwt = require('jsonwebtoken')
 const cryptoRandomString = require('crypto-random-string')

 const userDailyStatsSchema = mongoose.Schema({
     mtb_id: {
         type: String,
         required: true,
         trim: true
     },
     temperature: [{
         entry: [{
             day: {
                 type: String,
                 trim: true
             },
             daily_average: {
                 type: String,
                 trim: tru
             },
             indv_entry: [{
                 time: {
                     type: String,
                     trim: true
                 },
                 temperature_val: {
                     type: Number,
                     trim: true
                 },
             }]
         }]
     }],
     blood_pressure: [{
         entry: [{
             day: {
                 type: String,
                 trim: true
             },
             daily_average: {
                 type: String,
                 trim: tru
             },
             indv_entry: [{
                 time: {
                     type: String,
                     trim: true
                 },
                 blood_pressure_val: {
                     type: Number,
                     trim: true
                 },
             }]
         }]
     }],
     sugar_level: [{
         entry: [{
             day: {
                 type: String,
                 trim: true
             },
             daily_average: {
                 type: String,
                 trim: tru
             },
             indv_entry: [{
                 time: {
                     type: String,
                     trim: true
                 },
                 sugar_level_val: {
                     type: Number,
                     trim: true
                 },
             }]
         }]
     }],
     notes: [{
         entry: [{
             day: {
                 type: String,
                 trim: true
             },
             indv_entry: [{
                 time: {
                     type: String,
                     trim: true
                 },
                 note: {
                     type: String,
                     trim: true
                 },
             }]
         }]
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