const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("../models/user.model");

// Create Schema
const shoppingCartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    products: [
        {
            productCode: String,
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity can not be less then 1."],
            },
            size: Number
        }
    ],
    active: {
        type: Boolean,
        default: true
    },
    modifiedOn: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });


const post = mongoose.model("shopping-cart", shoppingCartSchema);

module.exports = post;