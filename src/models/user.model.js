const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const userSchema = new Schema({
    username: {type: String, default:"User",required: true},
    phonenumber: {type: String, default:""},
    address: {type: String, default: ""},
    email: {type: String},
    picture:{type: String, default:"/images/default-user.jpg"},
    modifiedOn: {
        type: Date,
        default: Date.now
    },
    /**
     * 0 - Normal user
     * 1 - Admin
     */
    role: {type: Number, default: 0,required: true},
    password: {type: String},
    google: {
        id: String,
        token: String
    }

},{timestamps: true});

const user = mongoose.model("user", userSchema);

module.exports = user;