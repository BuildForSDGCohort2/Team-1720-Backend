 const mongoose = require('mongoose')
 const validator = require('validator')
 const bcrypt = require('bcryptjs')
 const jwt = require('jsonwebtoken')
 const cryptoRandomString = require('crypto-random-string')

 const userChatSchema = mongoose.Schema({
     mtb_id: {
         type: String,
         required: true,
         trim: true
     },
     request_id: {
         type: String,
         required: true,
         trim: true
     },
     request_confirmation_date: {
         type: Date
     },
     chats: [{
         contact: [{
             mtb_id: {
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
         message: [{
             mtb_id: {
                 type: String
             },
             message: {
                 type: String
             },
             message_sent_date: {
                 type: Date
             },
             message_delivered_successfully: {
                 type: Array
             },
             message_has_been_read: {
                 type: Array
             },
             attachments: [{
                 attachment_fldr_id: {
                     type: String
                 },
                 attachment_type: {
                     type: String
                 },
                 attachment_file: {
                     type: String
                 },
                 attachment_meta_description: {
                     type: String
                 },
                 attachment_upload_date: {
                     type: Date
                 }
             }]
         }],
     }],
     video_chat: [{
         video_chat_request_id: {
             type: String
         },
         video_chat_request_date: {
             type: Date
         },
         video_chat_request_initiated_by: {
             type: String
         },
         video_chat_request_duration: {
             type: String
         },
         video_chat_request_calling_users: [{
             video_chat_request_incomming_user_id: {
                 type: String
             },
             video_chat_request_incomming_user_answered: {
                 type: Boolean
             },
             video_chat_request_incomming_user_was_online: {
                 type: Boolean
             }
         }]
     }],
     audio_chat: [{
         audio_chat_request_id: {
             type: String
         },
         audio_chat_request_initiated_by: {
             type: String
         },
         audio_chat_request_date: {
             type: Date
         },
         audio_chat_request_duration: {
             type: String
         },
         audio_chat_request_calling_users: [{
             audio_chat_request_incomming_user_id: {
                 type: String
             },
             audio_chat_request_incomming_user_answered: {
                 type: Boolean
             },
             audio_chat_request_incomming_user_was_online: {
                 type: Boolean
             }
         }]
     }],
     doctor_notes: [{
         note_id: {
             type: String
         },
         note_created_by: {
             type: String
         },
         note_content: {
             type: String
         },
         note_created_date: {
             type: Date
         },
         note_was_updated: {
             type: Boolean
         },
         note_updated_date: {
             type: Date
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