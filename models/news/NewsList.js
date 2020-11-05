const mongoose = require('mongoose');

const newsListSchema = mongoose.Schema({
    news_name: {
        type: String,
        required: true,
        trim: true
    },
    news_link: {
        type: String,
        required: true,
        trim: true
    },
    news_rss_links: {
        type: Object,
        required: true,
        trim: true
    },
    news_abbrv: {
        type: String,
        required: true,
        trim: true
    }
})

// Find all of the lists.
newsListSchema.statics.findAllNewsLists = async() => {
    // Search for a user by email and password.
    const newsList = await NewsList.find({})

    if (!newsList) {
        throw new Error({
            error: 'Invalid request'
        })
    }

    return newsList;
}

// Find single channel of the lists.
newsListSchema.statics.findOneNewsChannel = async(channel_name) => {
    // Search for a user by email and password.
    const newsList = await NewsList.find({ "news_name": channel_name })

    if (!newsList) {
        throw new Error({
            error: 'Invalid request'
        })
    }

    return newsList;
}



const NewsList = mongoose.model(process.env.DB_PREFIX + 'News_List', newsListSchema);
module.exports = NewsList