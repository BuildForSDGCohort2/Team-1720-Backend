const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cryptoRandomString = require('crypto-random-string')

const userAddressSchema = mongoose.Schema({
    mtb_id: {
        type: String,
        required: true,
        trim: true
    },
    home_address: [{
        street_address: {
            type: String,
            trim: true
        },
        suburb: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        province: {
            type: String,
            trim: true
        },
        zip_code: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        }
    }],
    work_address: [{
        street_address: {
            type: String,
            trim: true
        },
        suburb: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        province: {
            type: String,
            trim: true
        },
        zip_code: {
            type: String,
            trim: true
        },
        country: {
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
        updated_date: {
            type: Date,
            default: Date.now
        }
    }]
});

// Find the user
userAddressSchema.statics.findUserAddress = async(user_id) => {

    const user = await UserAddresses.findOne({
        mtb_id: user_id
    });

    // if (!user) {
    //     throw TypeError('User is not found');
    // }

    if (user === null) {
        return "User address does not exist";
    }

    return user;
}

// Fetch the user address
userAddressSchema.statics.getUserAddress = async(user_id) => {

    // Fetch the user address
    const updatedUserAddress = await UserAddresses.findOne({ "mtb_id": user_id });

    if (!updatedUserAddress) {
        throw new Error('No user address was found!');
    }

    return updatedUserAddress;
}

// Update the user address information
userAddressSchema.statics.updateUserAddress = async(user_id, data) => {

    const updatedAddress = await UserAddresses.updateOne({ "mtb_id": user_id }, { $set: data }, { new: true });

    if (!updatedAddress.ok) {
        return ({ "message": "Addresss failed to update" });
    }

    // Fetch the updated profile.
    const updatedUserAddress = await UserAddresses.findOne({ "mtb_id": user_id });

    if (!updatedUserAddress) {
        throw new Error({
            error: 'Address update was not updated successfully'
        });
    }

    return updatedUserAddress;

}

const UserAddresses = mongoose.model(process.env.DB_PREFIX + 'User_Address', userAddressSchema)

module.exports = UserAddresses