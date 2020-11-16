const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cryptoRandomString = require('crypto-random-string')

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    terms_and_conditions: {
        type: Boolean,
        required: true,
        trim: true
    },
    date_of_birth: {
        type: String,
        required: true,
        trim: true
    },
    weight: {
        type: Number,
    },
    height: {
        type: Number
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({
                    error: 'Invalid Email address'
                })
            }
        }
    },
    mobile: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    has_updated_password: {
        type: Boolean
    },
    updated_password: [{
        recieved_confirmation_email: { type: Boolean },
        confirmation_email: { type: String },
        ip_location: { type: String },
        browser: { type: String },
        date_updated: { type: String }
    }],
    user_status: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        required: true
    },
    user_account_verified: {
        type: Boolean
    },
    tokens: [{
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
})

userSchema.pre('save', async function(next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next();
})


// Updating on update
userSchema.pre('updateMany', async function(next) {
    // Hash the password before saving the user model
    const user = this

    if (user._update.password !== undefined && uuser._update.password.length > 0) {
        user._update.password = await bcrypt.hash(user._update.password, 10)
    }

    next();
})


userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const randoms = cryptoRandomString({
        length: 60
    });

    const token = jwt.sign({
        _id: user._id
    }, process.env.JWT_KEY) + randoms

    user.tokens = user.tokens.concat({
        token
    })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({
        email
    })
    if (!user) {
        // throw new Error({
        //     error: 'Invalid login credentials'
        // })
        return { 'error': 'Invalid login credentials' };
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        // throw new Error({
        //     error: 'Invalid login credentials'
        // });
        return { 'error': 'Invalid login credentials' };
    }
    return user
}

// Find User for reset password
userSchema.statics.findByEmail = async(email) => {
    const user = await User.findOne({
        email
    });

    if (!user) {
        throw TypeError('Invalid email provided');
    }

    return user;
}

// Find User for reset password
userSchema.statics.findByRegistrationID = async(email, mobile) => {

    // Check for empty fields
    let query;

    if (email.length === 0 && mobile.length > 0) {
        query = { mobile };
    } else if (mobile.length === 0 && email.length > 0) {
        query = { email };
    } else if (mobile.length > 0 && email.length > 0) {
        query = { $or: [{ email, mobile }] };
    } else {
        return { "message": "Invalid request" }
    }

    const user = await User.findOne(query);

    if (!user) {
        throw TypeError('Invalid email provided');
    }

    return user;
}

// Update the users password.
userSchema.statics.updateSingleUserPassword = async(user_id, password) => {

    const currentUser = await User.findOne({ _id: user_id });

    const nowDate = Date.now();

    const user = await User.updateMany({ _id: user_id }, {
        password: password,
        updated_password: currentUser.updated_password.concat({
            recieved_confirmation_email: true,
            date_updated: nowDate
        })
    });

    if (!user) {
        throw new Error({
            error: 'Invalid login credentials'
        })
    }

    return user;
}

// Update the users account verification.
userSchema.statics.updateSingleUserVerificationAccount = async(user_id) => {

    const user = await User.updateMany({
        _id: user_id
    }, {
        user_account_verified: true,
        user_status: "newly verified"
    });

    if (!user) {
        throw new Error({
            error: 'Invalid login credentials'
        })
    }

    return user;

}


const User = mongoose.model(process.env.DB_PREFIX + 'User', userSchema)

module.exports = User