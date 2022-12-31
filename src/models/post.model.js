const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const postSchema = new Schema({
    title: {type: String, default:""},
    postImgs: String,
},{timestamps: true});
const post = mongoose.model("post", postSchema);

module.exports = post;