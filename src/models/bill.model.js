const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const billSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    orders: [
        {
            orderID: {
                type: mongoose.Schema.Types.ObjectId,
                index: true,
                required: true,
                auto: true,
            },
            products: [
                {
                    productCode: String,
                    quantity: {
                        type: Number,
                        required: true,
                        min: [1, "Quantity can not be less then 1."],
                    },
                    size: Number,
                }
            ],
            phonenumber: { type: String, required: true },
            address: { type: String, required: true },
            date: {
                type: Date,
                default: Date.now
            }
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

const bill = mongoose.model("bill", billSchema);

module.exports = bill;