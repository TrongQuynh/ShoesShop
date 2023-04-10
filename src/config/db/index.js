const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config({
    path: path.resolve(__dirname, '../../../.env')
});

// let mongoDB = process.env.MONGODB_URL_DEPLOY;

let mongoDB = "mongodb://localhost:27017/HanShoes_DB";
// let mongoDB = "mongodb+srv://trongquynh:RrloGAN43Wctep8Q@cluster1.qhzo2pb.mongodb.net/HanShoes_DB";
let connect = mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("2.Connect DB Success!");
    })
    .catch(() => {
        console.log("2.Connect DB Fail :(");
    })
module.exports = { connect };