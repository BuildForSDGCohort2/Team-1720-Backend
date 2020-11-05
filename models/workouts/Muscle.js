const mongoose = require('mongoose')
const validator = require('validator')

const muscleSchema = mongoose.Schema({
    muscle_name: {
        type: String,
        required: true,
        trim: true
    },
    muscles_exercises: {
        type: Array
    },
    date_added: {
        type: String,
        required: true,
        trim: true
    },
    date_updated: {
        type: String,
    }
});

const Muscle = mongoose.model(process.env.DB_PREFIX + 'Workout_Muscle', muscleSchema)

module.exports = Muscle