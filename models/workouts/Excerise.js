const mongoose = require('mongoose')
const validator = require('validator')

const exerciseSchema = mongoose.Schema({
    exercise_name: {
        type: String,
        required: true,
        trim: true
    },
    exercise_parent: {
        type: String,
        required: true,
        trim: true
    },
    exercise_parent: {
        type: String,
        required: true,
        trim: true
    },
    exercise_is_parent: {
        type: Boolean,
        required: true,
        trim: true
    },
    exercise_recomended_reps: {
        type: String,
        required: true,
        trim: true
    },
    exercise_recomended_sets: {
        type: Boolean,
        required: true,
        trim: true
    },
    date_added: {
        type: String,
        required: true,
        trim: true
    },
    exercise_cost: {
        type: Number,
        required: true
    }
});

const Exercise = mongoose.model(process.env.DB_PREFIX + 'Workout_Exercise', exerciseSchema)

module.exports = Exercise