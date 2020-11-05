const mongoose = require('mongoose');

const newsContentSchema = mongoose.Schema({
    news_channel_name: {
        type: String,
        required: true,
        trim: true
    },
    news_channel_type: {
        type: String,
        required: true,
        trim: true
    },
    news_channel_ref_id: {
        type: String,
        required: true,
        trim: true
    },
    news_title: {
        type: String,
        required: true,
        trim: true
    },
    news_content: {
        type: String,
        required: true,
        trim: true
    },
    news_link: {
        type: String,
        required: true,
        trim: true
    },
    news_posted: {
        type: String,
        required: true,
        trim: true
    },
    news_fetched_time: {
        type: Date,
        default: Date.now
    }
})

// Find all of the lists.
newsContentSchema.statics.findAllNewsArticles = async() => {
    // Search for a user by email and password.
    const newsContent = await NewsContent.find({})

    if (!newsContent) {
        throw new Error({
            error: 'Invalid request'
        })
    }

    return newsContent;
}




const NewsContent = mongoose.model(process.env.DB_PREFIX + 'News_Content', newsContentSchema);
module.exports = NewsContent