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
     notification_id: {
         type: String
     },
     notification_type: {
         type: String,
         trim: true
     },
     has_seen_notification: {
         type: Boolean
     },
     notification_send_to: {
         type: Array
     },
     invitation_notification: [{
         mtb_patient_id: {
             type: String
         },
         mtb_chat_id: {
             type: String
         },
         mtb_request_id: {
             type: String
         },
         mtb_doctor_message: {
             type: String
         },
         mtb_patient_id_accepted_doctor_invitation: {
             type: Boolean
         },
         mtb_doctor_invitation_id: {
             type: String
         },
         send_invitation: {
             type: Boolean
         },
     }],
     message_notification: [{
         mtb_patient_id: {
             type: String
         },
         mtb_chat_id: {
             type: String
         },
         mtb_request_id: {
             type: String
         },
         mtb__message_id: {
             type: String
         },
         mtb_message_summary: {
             type: Boolean
         }
     }],
     reminder_notification: [{
         reminder_type: {
             type: String
         },
         reminder_consultaion_date: {
             type: String
         },
         reminder_pay_invoice_id: {
             type: String
         },
         reminder_follow_up: {
             type: String
         },
         reminder_follow_up_mtb_patient_id: {
             type: String
         },
         reminder_follow_up_mtb_doctor_id: {
             type: String
         },
         reminder_follow_up_mtb_chat_id: {
             type: String
         },
         reminder_follow_up_mtb_request_id: {
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