const express = require('express');
const router = express.Router();
const User = require('../models/users/User');
const UserReset = require('../models/users/UserReset');
const UserConfirmation = require('../models/users/UserConfirmation');
const UserNotFound = require('../models/users/UserNotRegistered');
const bcryptjs = require('bcrypt');
const generator = require('generate-password');;
const auth = require('../middleware/auth')
const emailReset = require('../helpers/emailHelpers').emailHelperResetPassword;
const passwordFinalEmail = require('../helpers/emailHelpers').emailHelperPasswordHasBeenReseted;
const registerNewUserEmail = require('../helpers/emailHelpers').emailHelperRegister;
const userNotFound = require('../helpers/emailHelpers').emailHelperResetUserNotFound;
const resetLinkHash = require('../helpers/generateHash').resetHashLink;
const resetLinkRefHash = require('../helpers/generateHash').resetRefHash;
const accountConfirmationLinkHash = require('../helpers/generateHash').confirmationHashLink;
const accountConfirmationLinkRefHash = require('../helpers/generateHash').confirmationHashLinkRef;
const userRefHash = require('../helpers/generateHash').userNotFoundHashLinkRef;
const getUTC = require('../helpers/timeHelper').getUTCNow;
const getUTCOffset = require('../helpers/timeHelper').getUTCOffset;
const isTokenValid = require('../helpers/tokenValidator').isTokenExpired;



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send({ 'message': 'respond with a resource - mtatibu' });
});

router.post('/register', async(req, res) => {

    const gen_password = generator.generate({ length: 14, numbers: true, symbols: true });

    const newUserSubmitted = {
        user_type: req.body.userType,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        full_name: req.body.fullName,
        gender: req.body.gender,
        terms_and_conditions: req.body.termsAndConditions,
        date_of_birth: req.body.dateOfBirth,
        email: req.body.email,
        mobile: req.body.mobile,
        user_status: req.body.userStatus,
        user_account_verified: req.body.verified,
        // password: gen_password
        password: req.body.password
    };
    // return false;
    const user = new User(newUserSubmitted);

    // const userSignUp = await User.findByRegistrationID(req.body.email, req.body.mobile);

    // Check if the user already exists
    try {

        const userSignUp = await User.findByRegistrationID(req.body.email, req.body.mobile);

        if (userSignUp) {
            return res.status(403).send({ "message": "User already exists" });
        }

        // const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken();

        // Create a new user
        try {

            const accConfirmTempRef = await accountConfirmationLinkRefHash();
            const accConfirmLinkToken = await accountConfirmationLinkHash(accConfirmTempRef);
            const accTempToken = accConfirmLinkToken.token;
            const accTempExtras = accConfirmLinkToken.extras;
            const expireTime = new Date().setHours(new Date().getHours() + 1);
            const { _id, email, full_name } = user;

            const accConfirmTempUser = {
                user_temp_ref: accConfirmTempRef,
                user_id: _id,
                time_added: Date.now(),
                expire: expireTime,
                status: "pre-confirmed",
                email_address_to: email,
                token: accTempToken,
                extra_val: accTempExtras
            }

            try {
                const userConfirmTemp = new UserConfirmation(accConfirmTempUser);
                await userConfirmTemp.save(async(err, user) => {
                    if (err) {
                        return res.status(403).send({
                            "message": "User temp was not saved"
                        });
                    }

                    const sendEmail = await registerNewUserEmail(email, full_name, accConfirmTempRef);

                    if (sendEmail === "Email was sent") {
                        res.status(200).send({
                            "message": token
                        })
                    }
                })
            } catch (error) {
                return res.status(403).send({ "message": "User temp was not saved" });
            }

            // res.status(201).send({
            //     token
            // })


        } catch (error) {
            res.status(400).send({
                'message': error
            })
        }

    } catch (error) {
        if (error) {

            // console.error(error.message);

            if (error.message.includes("duplicate key")) {
                return res.status(403).send({ "message": "User already exists" });
            }

            return res.status(400).send({ "message": error.message });

            // console.error(error.message);
        }
    }

})

router.get('/confirm-user/', async(req, res) => {

    const confirmation_id = req.query.id;

    try {
        const findUserTemp = await UserConfirmation.findUserConfirmationTempByRefLink(confirmation_id);

        if (!findUserTemp) {
            return res.status(403).send({ "message": "Finding user error" });
        }

        const { user_temp_ref, user_id } = findUserTemp;

        // Found the user
        if (user_temp_ref === confirmation_id) {
            // Token ref has not been tampered with

            console.log(user_id);

            try {
                // Update the user 
                const updateUser = await User.updateSingleUserVerificationAccount(user_id);

                if (!updateUser) {
                    return res.status(403).send({
                        "message": "Error updating the user"
                    });
                }

                return res.status(200).send({
                    "message": "Your account has been verified."
                });
            } catch (error) {
                return res.status(403).send({
                    "message": "Error trying to update the user"
                });
            }
        } else {
            return res.status(403).send({
                "message": "This token has been tampered with"
            });
        }

    } catch (error) {
        if (error) {
            return res.status(403).send({
                "message": "User temp function was not successful"
            });
        }
    }

    return res.status(200).send({ "message": "Everything worked correctly" });
})

router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const {
            username,
            password
        } = req.body;

        const user = await User.findByCredentials(username, password);

        if (!user) {
            return res.status(401).send({
                message: 'Login failed! Please enter the correct username and password'
            })
        }

        // There was an error.
        if (user.error !== undefined && user.error.length > 0) {
            return res.status(401).send({
                message: 'Login failed! Please enter the correct username and password'
            });
        }

        const token = await user.generateAuthToken();

        res.send({
            name: user.firstName,
            surname: user.lastName,
            gender: user.gender,
            age: user.age,
            token
        })
    } catch (error) {
        res.status(400).send({
            'message': error
        });
    }

});

router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    res.status(200).send(req.user);
});

router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    res.status(200).send(req.user);
});

router.post('/me/logout', auth, async(req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        await req.user.save();

        res.status(200).send({
            'message': 'Successful Logout',
            'status': 'success'
        });
    } catch (error) {
        res.status(500).send({
            'message': error,
            'status': 'failed'
        })
    }
})

router.post('/me/logout-all', auth, async(req, res) => {
    console.log('This is the success message.');
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        console.log('This is the error message.');
        res.status(500).send(error)
    }
})

// **************************
// RESET USER PASSWORD
// **************************

router.post('/reset-password', async(req, res) => {
    if (!req.body) {
        res.status(402).send({ 'message': 'Permission denied' });
        return false;
    }

    if (!req.body.email) {
        res.status(402).send({
            'message': 'Please provide a valid email object'
        });
        return false;
    }

    const { email } = req.body;
    const { country, city, ip } = req.ipInfo;

    if (req.body && req.body.email) {

        try {
            const userReset = await User.findByEmail(email);
            // User was not found.
            if (!userReset) {
                return res.status(401).send({
                    error: 'User does not exists'
                });
            }


            let responseUser = userReset.toObject();
            let reqIPInfo = req.ipInfo;
            let user_temp_ref = resetLinkRefHash();


            let user_id = responseUser._id;
            let user_full_name = responseUser.full_name;
            let user_email = responseUser.email;
            let IP_INFO = { "country": reqIPInfo.country, "city": reqIPInfo.city, "ip": reqIPInfo.ip };
            // let test = await createUserReset(user_temp_ref, user_id)

            // let user_temp_id = user.user_temp_ref;
            const getUserHash = await resetLinkHash(user_temp_ref);

            // Create the reset password table.
            const userResetProfile = new UserReset({
                user_temp_ref: user_temp_ref,
                user_id: user_id,
                time_added: getUTC(),
                expire: getUTCOffset(1),
                status: "initiated",
                ip_location: IP_INFO,
                email_address_to: user_email,
                token: getUserHash.token,
                extra_val: getUserHash.extras
            });

            await userResetProfile.save(async(error, user) => {
                if (error) {
                    console.log('Error: User was not found');
                    return error;
                }

                let user_temp_id = user.user_temp_ref;

                try {

                    const redirect_link = process.env.URL_DEV + "/update-password/" + user_temp_id;

                    let emailTrigger = await emailReset(user_email, user_full_name, IP_INFO, redirect_link);

                    console.log("Hello World");

                    if (emailTrigger === "Email was sent") {
                        return res.status(200).send({
                            "message": "Email was sent"
                        })
                    }

                } catch (error) {
                    res.status(400).send({
                        "message": error
                    })
                }

            });

        } catch (error) {

            const refId = await userRefHash();
            const userNotReg = await new UserNotFound({
                user_temp_ref: refId,
                time_added: Date.now(),
                status: "Not Registered",
                ip_location: { "city": city, "country": country, "ip": ip },
                email_address_to: email
            });

            userNotReg.save();

            const userNotFoundEmail = await userNotFound(email);

            if (userNotFoundEmail === "Email was sent") {
                return res.status(401).send({
                    error: 'User does not exists'
                });
            }

            res.status(400).send({
                'message': "User does not exist"
            })
        }
    }
});

// **************************
// UPDATE RESET USER PASSWORD
// **************************
router.post('/update-password', async(req, res) => {

    if (!req.body) {
        res.status(402).send({
            'message': 'Permission denied'
        });
        return false;
    }

    if (!req.body.ref_link) {
        res.status(402).send({
            'message': 'Please provide a valid link!'
        });
        return false;
    }

    if (req.body && req.body.ref_link) {

        // Test to see if the ref is valid.
        try {

            const { ref_link, password } = req.body;

            const userResetUser = await UserReset.findUserResetByRefLink(ref_link);

            // User was not found.
            if (!userResetUser) {
                return res.status(403).send({
                    error: 'Permission denied: You are not allowed to be here....'
                });
            }

            // Test to see if the token is still valid.
            const { token, extra_val, user_id, status, email_address_to } = userResetUser
            const tokenValidity = await isTokenValid(token, extra_val);

            if (tokenValidity === "Token expired") {

                // Update the user status to expired.

                res.status(403).send({
                    'message': 'Permission denied: Token has expired'
                });
                return false;
            }

            if (tokenValidity === ref_link && status === "initiated") {

                const currentDate = Date.now();

                const updatePassword = {
                    password: password,
                    updated_password: [{
                        recieved_confirmation_email: true,
                        date_updated: currentDate,
                        user_temp_ref: ref_link
                    }]
                }

                try {

                    const updateUserPassword = await User.updateSingleUserPassword(user_id, password);

                    if (updateUserPassword.ok === 0) {
                        return res.status(403).send({
                            "message": updatePassword
                        });
                    }


                    if (updateUserPassword.ok === 1) {

                        const updatePasswordArray = await UserReset.deactivateToken(ref_link);

                        if (!updatePasswordArray) {
                            res.status(403).send({
                                "message": "User token was not deactivated."
                            });
                            return;
                        }

                        // Trigger the final email

                        try {
                            const fullUser = await User.findById(user_id);

                            let emailTrigger = await passwordFinalEmail(fullUser.email, fullUser.full_name);

                            if (emailTrigger === "Email was sent") {
                                return res.status(200).send({
                                    "message": "Email was sent"
                                })
                            }

                            return res.status(403).send({
                                "message": "Email was not sent"
                            })
                        } catch {
                            return res.status(200).send({
                                "message": "User password has been updated successfully. Though final email was not sent."
                            });
                        }

                    } else {
                        // Update was not successful
                        res.status(403).send({
                            "message": "User password has not been updated successfully."
                        });
                        return;
                    }

                } catch (error) {
                    res.status(403).send({ "message": error });
                    return;
                }
            } else {
                return res.status(403).send({
                    "message": "Something went wrong"
                });
            }

        } catch {
            res.status(403).send({
                'message': 'Permission denied: User not found'
            });
            return false;
        }


    } else {
        res.status(401).send({
            'message': 'Permission denied: No link provided'
        });
        return false;
    }

});


// **************************
// UPDATE THE PROFILE INFO
// **************************

router.post('/update-profile', auth, async(req, res) => {

    // let first_name;
    // let last_name;
    // let full_name;
    // let gender;
    // let terms_and_conditions;
    // let date_of_birth;
    // let email;
    // let mobile;
    // let user_status;
    // let user_account_verified;
    // let password;
    // let height;
    // let weight;
    // let about_me;

    const token = req.user.tokens[0].token;
    const id = req.user.tokens[0]._id;
    let update_data = {};

    // Updating the first_name
    if (req.body.firstName !== undefined && req.body.firstName.length > 0) {
        update_data.first_name = req.body.firstName;
    }

    // Updating the last_name
    if (req.body.lastName !== undefined && req.body.lastName.length > 0) {
        update_data.last_name = req.body.lastName;
    }

    // Updating the full_name
    if (req.body.fullName !== undefined && req.body.fullName.length > 0) {
        update_data.full_name = req.body.fullName;
    }

    // Updating the gender
    if (req.body.gender !== undefined && req.body.gender.length > 0) {
        update_data.gender = req.body.gender;
    }

    // Updating the terms_and_conditions
    if (req.body.terms_and_conditions !== undefined && req.body.terms_and_conditions.length > 0) {
        update_data.terms_and_conditions = req.body.termsAndConditions;
    }

    // Updating the date_of_birth
    if (req.body.date_of_birth !== undefined && req.body.date_of_birth.length > 0) {
        update_data.date_of_birth = req.body.dateOfBirth;
    }

    // Updating the email
    if (req.body.email !== undefined && req.body.email.length > 0) {
        update_data.email = req.body.email;
    }

    // Updating the mobile
    if (req.body.mobile !== undefined && req.body.mobile.length > 0) {
        update_data.mobile = req.body.mobile;
    }

    // Updating the user_status
    if (req.body.user_status !== undefined && req.body.user_status.length > 0) {
        update_data.user_status = req.body.userStatus;
    }

    // Updating the user_account_verified
    if (req.body.user_account_verified !== undefined && req.body.user_account_verified.length > 0) {
        update_data.user_account_verified = req.body.userAccountVerified;
    }

    // Updating the height
    if (req.body.height !== undefined && req.body.height > 0) {
        update_data.height = req.body.height;
    }

    // Updating the weight
    if (req.body.weight !== undefined && req.body.weight > 0) {
        update_data.weight = req.body.weight;
    }

    // Updating the about_me
    if (req.body.aboutMe !== undefined && req.body.aboutMe.length > 0) {
        update_data.about_me = req.body.aboutMe;
    }

    try {
        const update_profile_info = await User.updateUserProfile(id, update_data);


        if (!update_profile_info) {
            return res.status(403).send({
                "message": "Error updating profile"
            });
        }

        const {
            first_name,
            last_name,
            full_name,
            gender,
            email,
            mobile,
            date_of_birth,
            about_me,
            height,
            weight
        } = update_profile_info;

        const user = {
            first_name: first_name,
            last_name: last_name,
            full_name: full_name,
            gender: gender,
            date_of_birth: date_of_birth,
            email: email,
            mobile: mobile,
            about_me: about_me,
            height: height,
            weight: weight
        }

        res.status(200).send({ message: "Update was successful", user: user });

    } catch (error) {
        console.log(error);
        res.status(400).send({ "message": error });
    }


    // res.status(200).send({ message: "Response was found.." });
});


module.exports = router;