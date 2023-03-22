const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const orderSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    orders:[
        {
            orderCode: {type: String, required: true},
            username: String,
            products: [
                {
                    productID: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: [1, "Quantity can not be less then 1."],
                    },
                    size: Number,
                }
            ],
            phonenumber: { type: String, required: true },
            address: { 
                detail:{type: String},
                province: {type: String},
                district: {type: String},
                ward: {type: String},
            },
            /*
                0 - inWaitConfirm
                1 - inPrepareOrder
                2 - inDeliveryOrder
                3 - Success
                4 - isOrderCancel
                
            */
            status: [
                {
                    _id: false,
                    key:{
                        type: String
                    },
                    value:{
                        type: Boolean
                    },
                    date: { type: Date, default: Date.now },
                }
            ], 
            note: String,
            isPaymentOnline:{type: Boolean, default:false},
            orderAt: { type: Date, default: Date.now }
        }
    ]

},{timestamps: true});

const order = mongoose.model("order", orderSchema);

module.exports = order;