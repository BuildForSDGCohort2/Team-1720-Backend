const express = require('express');
const router = express.Router();
const Parser = require('rss-parser');
let parser = new Parser();
const stripHtml = require("string-strip-html");
var Crawler = require("crawler");
const htmlToText = require('html-to-text');
var striptags = require('striptags');
const rp = require('request-promise');
const $ = require('cheerio');

const fetch = require('node-fetch');

const NewsList = require('../models/news/NewsList');
const NewsContent = require('../models/news/NewsContent');



/* GET home page. */
router.get('/', function(req, res, next) {
    res.status('200').send('Welcoome to the News Feed');
});

router.get('/all', async(req, res) => {

    try {
        const newsContent = await NewsContent.findAllNewsArticles()
        if (!newsContent) {
            return res.status(401).send({
                error: 'Invalid Request'
            })
        }

        res.status(200).send({
            newsContent
        });

    } catch (error) {
        res.status(400).send({
            'message': error
        })
    }

});

router.post('/update', async(req, res) => {
    const selected_channel = req.body.news_channel;

    try {
        const newsList = await NewsList.findOneNewsChannel(selected_channel)
        if (!newsList) {
            return res.status(401).send({
                error: 'Invalid Request'
            })
        }

        const news_name = newsList[0].news_name;
        const news_id = newsList[0]._id;
        const news_rss_links = newsList[0].news_rss_links;

        news_rss_links.map((value, index) => {
            const rss_link = value.rss_link;
            const rss_type = value.rss_type;
            fecthRSSFeed(rss_link, news_name, rss_type, news_id);
        });

        res.status(200).send({
            "message": "All Updated"
        });

    } catch (error) {
        res.status(400).send({
            'message': error
        })
    }
});

router.post('/updateall', async(req, res) => {

    try {
        const newsList = await NewsList.findAllNewsLists()
        if (!newsList) {
            return res.status(401).send({
                error: 'Invalid Request'
            })
        }

        newsList.map(val => {
            const news_name = val.news_name;
            const news_id = val._id;
            const news_rss_links = val.news_rss_links;

            news_rss_links.map((value, index) => {
                const rss_link = value.rss_link;
                const rss_type = value.rss_type;

                fecthRSSFeed(rss_link, news_name, rss_type, news_id);
            });
        })

        res.status(200).send({
            "message": "All posts have been updated"
        });

    } catch (error) {
        res.status(400).send({
            'message': error
        })
    }
});


// **********************************
// **********************************
// Functions to Fetch RSS Feed
// **********************************
// **********************************
fecthRSSFeed = (rss_url, rss_channel_name, rss_channel_type, news_channel_id) => {
    (async() => {
        let feed = await parser.parseURL(rss_url);

        // Looping through all of the RSS feeds
        feed.items.forEach(item => {
            const feed_link = item.link;

            const feed_pub_date = item.pubDate;

            // Cleaning News 24 Channel
            if (rss_channel_name === "News 24") {
                feed_title = item.title.replace('News24.com |', '');
            } else {
                feed_title = item.title;
            }



            // Handling the type of News Channel
            switch (rss_channel_name) {
                case 'News 24':
                    fetchNews24Article(feed_link, feed_title, rss_channel_type, rss_channel_name, news_channel_id, feed_pub_date);
                    return fetchNews24Article;
                    break;
                case 'Mail and Guardian':
                    fetchNews24Article(feed_link, feed_title, rss_channel_type, rss_channel_name, news_channel_id, feed_pub_date);
                    break;
                case 'Sowetan Live':
                    fetchNews24Article(feed_link, feed_title, rss_channel_type, rss_channel_name, news_channel_id, feed_pub_date);
                    break;
                case 'My Broadband':
                    fetchNews24Article(feed_link, feed_title, rss_channel_type, rss_channel_name, news_channel_id, feed_pub_date);
                    break;
                case 'Business Tech':
                    fetchNews24Article(feed_link, feed_title, rss_channel_type, rss_channel_name, news_channel_id, feed_pub_date);
                    break;
                case 'Eye Whitness News':
                    fetchNews24Article(feed_link, feed_title, rss_channel_type, rss_channel_name, news_channel_id, feed_pub_date);
                    break;
                case 'Times Live':
                    fetchNews24Article(feed_link, feed_title, rss_channel_type, rss_channel_name, news_channel_id, feed_pub_date);
                    break;
                case 'The Citizen':
                    fetchNews24Article(feed_link, feed_title, rss_channel_type, rss_channel_name, news_channel_id, feed_pub_date);
                    break;
                case 'Daily Maverick':
                    fetchNews24Article(feed_link, feed_title, rss_channel_type, rss_channel_name, news_channel_id, feed_pub_date);
                    break;
                case 'The South African':
                    fetchNews24Article(feed_link, feed_title, rss_channel_type, rss_channel_name, news_channel_id, feed_pub_date);
                    break;
                case 'ENCA':
                    fetchNews24Article(feed_link, feed_title, rss_channel_type, rss_channel_name, news_channel_id, feed_pub_date);
                    break;
                default:
                    console.log("No news channel was selected");
            }
        });

    })();
}

saveTheFeedContent = async(content) => {

    // Save The Content Back to the database
    try {
        const contentToSave = new NewsContent(content)
        await contentToSave.save();
        return contentToSave;
    } catch (error) {
        return error;
    }
}


// **********************************
// **********************************
// Functions to Fetch Data
// **********************************
// **********************************

fetchNews24Article = (feed_url, feed_title, feed_channel_type, feed_channel_name, feed_ref_id, feed_date_posted) => {
    // const url = 'https://www.news24.com/fin24/opinion/opinion-african-countries-can-seize-opportunities-created-by-us-china-tensions-20200617';

    rp(feed_url)
        .then(function(html) {
            // News 24 Get Page Data
            // console.log($.html($('.article__body', html)));
            const feedContent = $.html($('.article__body', html));

            // Construct the article to be saved.
            const content = {
                "news_channel_name": feed_channel_name,
                "news_channel_type": feed_channel_type,
                "news_channel_ref_id": feed_ref_id,
                "news_title": feed_title,
                "news_link": feed_url,
                "news_content": feedContent,
                "news_posted": feed_date_posted
            }

            // Save the article.
            saveTheFeedContent(content);

            return 'All Saved';
        })
        .catch(function(err) {

            //handle error
            return err;
        });
}


fetchMailAndGurdian = () => {
    const url = 'https://mg.co.za/friday/2020-07-05-lesedi-a-bright-star-alights-on-lulu-mlangeni/';
    rp(url)
        .then(function(html) {
            // News 24 Get Page Data
            // console.log($.html($('.article__body', html)));

            // Mail & Guardian.
            console.log($.html($('.tdb-block-inner > p', html)));
        })
        .catch(function(err) {
            //handle error
        });
}

fetchSowetanLive = () => {
    const url = 'https://www.sowetanlive.co.za/news/south-africa/2020-07-11-warning-graphic-content-five-confirmed-dead-in-zuurbekom-hostage-situation/';

    rp(url)
        .then(function(html) {
            // News 24 Get Page Data
            // console.log($.html($('.article__body', html)));

            // Mail & Guardian.
            console.log($.html($('.article-widget.article-widget-text p', html)));
        })
        .catch(function(err) {
            //handle error
        });
}

fetchEWN = () => {
    const url = 'https://ewn.co.za/2020/07/11/5-killed-in-hostage-situation-at-gauteng-church';

    rp(url)
        .then(function(html) {
            // News 24 Get Page Data
            // console.log($.html($('.article__body', html)));

            // Mail & Guardian.
            console.log($.html($('.article-full p', html)));
        })
        .catch(function(err) {
            //handle error
        });

}

fetchMyBroadband = () => {
    const url = 'https://mybroadband.co.za/news/energy/359659-load-shedding-can-have-devastating-effect-on-work-from-home.html';

    rp(url)
        .then(function(html) {
            // News 24 Get Page Data
            // console.log($.html($('.article__body', html)));

            // Mail & Guardian.
            console.log($.html($('.the-post p', html)));
        })
        .catch(function(err) {
            //handle error
        });
}

fetchBusinessTech = () => {
    const url = 'https://businesstech.co.za/news/business/414289/different-world-same-south-africa-as-hijackings-return-to-pre-lockdown-levels/';

    rp(url)
        .then(function(html) {
            // News 24 Get Page Data
            // console.log($.html($('.article__body', html)));

            // Mail & Guardian.
            console.log($.html($('.entry-content', html)));
        })
        .catch(function(err) {
            //handle error
        });
}

fetchTimesLiveSouthAfrica = () => {
    const url = 'https://www.timeslive.co.za/news/africa/2020-07-11-two-dead-eight-rescued-in-lagos-building-collapse/';

    rp(url)
        .then(function(html) {
            // News 24 Get Page Data
            // console.log($.html($('.article__body', html)));

            // Mail & Guardian.
            console.log($.html($('.text p', html)));
        })
        .catch(function(err) {
            //handle error
        });
}

fetchTechCentral = () => {
    const url = 'https://techcentral.co.za/inside-the-new-space-race-to-connect-everything-on-earth/99549/';

    rp(url)
        .then(function(html) {
            // News 24 Get Page Data
            // console.log($.html($('.article__body', html)));

            // Mail & Guardian.
            console.log($.html($(
                'article.post.type-post p, article.post.type-post a, article.post.type-post h1, article.post.type-post h2, article.post.type-post h3, article.post.type-post h4, article.post.type-post h5, article.post.type-post h6, article.post.type-post strong, article.post.type-post ul, article.post.type-post li, article.post.type-post em, article.post.type-post img, article.post.type-post figcaption, article.post.type-post blockquote', html)));
        })
        .catch(function(err) {
            //handle error
        });

}

fetchIOL = () => {
    const url = 'https://www.iol.co.za/news/south-africa/gauteng/pretoria-man-falls-to-death-trying-to-avoid-flat-fire-50834389';

    rp(url)
        .then(function(html) {
            // News 24 Get Page Data
            // console.log($.html($('.article__body', html)));

            // Mail & Guardian.
            console.log($.html($(
                '.row.article p, .row.article a, .row.article h1, .row.article h2, .row.article h3, .row.article h4, .row.article h5, .row.article h6, .row.article strong, .row.article ul, .row.article ol, .row.article li, .row.article em, .row.article img, .row.article figcaption, .row.article figure', html)));
        })
        .catch(function(err) {
            //handle error
        });
}

// *****************************
// *****************************
// HELPER FUNCTIONS
// *****************************
// *****************************

allHtmlTags = (generalContainerClass) => {
    let query_tag_string = '';
    const approved_html_tags = ['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'article', 'blockquote', 'caption', 'ul', 'li', 'ol', 'figure', 'img'];

    approved_html_tags.forEach((element, index) => {

        if (index === 0) {
            query_tag_string += ' ' + generalContainerClass + ' ' + element;
        } else {
            query_tag_string += ', ' + generalContainerClass + ' ' + element;
        }

    });

    return query_tag_string;
}




module.exports = router;