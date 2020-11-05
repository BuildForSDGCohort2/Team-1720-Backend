const mongoose = require('mongoose')

const MONGO_USERNAME = process.env.DB_NAME;
const MONGO_PASSWORD = process.env.DB_PASSWORD;
const MONGO_HOSTNAME = process.env.DB_HOST;
const MONGO_PORT = process.env.DB_PORT;
const MONGO_DB = process.env.DB_DATABASENAME;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

console.log(process.env.DB_DATABASENAME);

mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(
        () => {
            console.log('Connection was successfull');
        },
        err => {
            console.log(err);
        }
    );

// mongoose.connect(process.env.MONGODB_URL, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true
//     })
//     .then(
//         () => {
//             console.log('Connection was successfull');
//         },
//         err => {
//             console.log(err);
//         }
//     );