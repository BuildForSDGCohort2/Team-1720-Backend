'use strict'

const nodemailer = require("nodemailer");


module.exports = {
    emailHelperResetPassword(user_email, user_name, IP_INFO, link) {

        if (!user_email) {
            return "User email not provided";
        }

        if (!user_name) {
            return "User full name was not provided";
        }

        if (!IP_INFO) {
            return "User address was not provided";
        }

        let w_from_name = "Wotho";
        let w_from_email = "dev@wotho.com";
        let w_email_to = user_email;
        let w_email_subject = user_name + " Wotho account password reset";



        // async..await is not allowed in global scope, must use a wrapper
        async function sendResetEmail() {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            // let testAccount = await nodemailer.createTestAccount();


            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'donna.bartoletti@ethereal.email', // generated ethereal user
                    pass: '9DkxEwg769V3qCpzqF', // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: w_from_name + " " + w_from_email, // sender address
                to: w_email_to, // list of receivers
                subject: w_email_subject, // Subject line
                text: "You have requested a password reset, /n please click the link below to resst your password", // plain text body
                html: "\
            <h2>You have requested a password reset</h2>\
            <p>You have requested a password reset<p>\
            <h4> from  " + IP_INFO.city + " " + IP_INFO.country + " " + IP_INFO.ip + " </h4>\
            <p>Please click on the link below to reset your password.</p>\
            <a href ='" + link + "' > Reset Password </a>",
            });


            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        sendResetEmail().catch(console.error);


        return "Email was sent";
    },
    emailHelperPasswordHasBeenReseted(user_email, user_name) {


        if (!user_email) {
            return "User email not provided";
        }

        if (!user_name) {
            return "User full name was not provided";
        }



        let w_from_name = "Wotho";
        let w_from_email = "dev@wotho.com";
        let w_email_to = user_email;
        let w_email_subject = user_name + " Wotho account password has been reset";


        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            // let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'donna.bartoletti@ethereal.email', // generated ethereal user
                    pass: '9DkxEwg769V3qCpzqF', // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: w_from_name + " " + w_from_email, // sender address
                to: w_email_to, // list of receivers
                subject: w_email_subject, // Subject line
                text: "You requested a password reset, /n and it has been completed. If this was not you, please contact support", // plain text body
                html: "\
            <h2>You requested a password reset</h2>\
            <p>You requested a password reset, and have completed the password reset<p>\
            <p>If this was not you, then please contact support as this might a hacker trying to infaltrate your account<p>\
            <a href='mailto:support@wotho.com'>Technical Support</a>",
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);


        return "Email was sent";
    },
    emailHelperRegister(user_email, user_name, user_temp_ref) {

        if (!user_email) {
            return "User email not provided";
        }

        if (!user_name) {
            return "User full name was not provided";
        }

        if (!user_temp_ref) {
            return "User temp ref was not provided";
        }



        let w_from_name = "Wotho";
        let w_from_email = "dev@wotho.com";
        let w_email_to = user_email;
        let w_email_subject = user_name + " Welcome to Wotho, account confirmation";


        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            // let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'donna.bartoletti@ethereal.email', // generated ethereal user
                    pass: '9DkxEwg769V3qCpzqF', // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: w_from_name + " " + w_from_email, // sender address
                to: w_email_to, // list of receivers
                subject: w_email_subject, // Subject line
                text: "Welcome to Wotho, /n We are glad to have on board and the final step to be a part of our community is just to click on the below link. If this was not you, please contact support", // plain text body
                html: "\
            <h2>Welcome to Wotho</h2>\
            <p> We are glad to have on board and the final step to be a part of our community is just to click on the below link <p> \
            <a href='http://localhost:3077/api/users/confirm-user/?id=" + user_temp_ref + "'>http: //localhost:3077/api/users/confirm-user/?id=" + user_temp_ref + "</a>\
            <p>If this was not you, then please contact support as this might a hacker trying to infaltrate your account<p>\
            <a href='mailto:support@wotho.com'>Technical Support</a>",
            });

            // console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);


        return "Email was sent";
    },
    emailHelperResetUserNotFound(user_email) {

        if (!user_email) {
            return "User email not provided";
        }


        let w_from_name = "Wotho";
        let w_from_email = "dev@wotho.com";
        let w_email_to = user_email;
        let w_email_subject = "Wotho user not found";


        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            // let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'donna.bartoletti@ethereal.email', // generated ethereal user
                    pass: '9DkxEwg769V3qCpzqF', // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: w_from_name + " " + w_from_email, // sender address
                to: w_email_to, // list of receivers
                subject: w_email_subject, // Subject line
                text: "Welcome to Wotho, /n It seems as we do not have you in our database, please register with us. If this was not you, please contact support", // plain text body
                html: "\
            <h2>Welcome to Wotho</h2>\
            <p> It seems as we do not have you in our database, please register with us <p> \
            <a href='http://localhost:3077/api/users/register'>Register Here</a>\
            <p>If this was not you, then please contact support as this might a hacker trying to infaltrate your account<p>\
            <a href='mailto:support@wotho.com'>Technical Support</a>",
            });

            // console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);


        return "Email was sent";
    }
}