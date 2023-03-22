
const cartController = require("../controllers/shoppingCart-controller");
const provincesData = require("../data/provinces.json");
const shoppingCartModel = require("../models/shoppingCart.model");
const billModel = require("../models/bill.model");
const userModel = require("../models/user.model");
const orderModel = require("../models/order.model");
// helper
const helper = require("../helpers/index");

let orderList = {};

function generateOrderCode(){
    let time = new Date().getTime() / 1000;
    let text = (Math.random() + 1).toString(36).substring(7);
    return String(parseInt(time)).slice(3,-1)+ text.toUpperCase();
}

class checkoutController {
    // [GET] /checkouts    
    async loadData(req, res, next) {
        let userId = req.userID;
        let products = userId == "" ? { cartProducts: [], totalBill: 0 } : await cartController.getCartProduct(userId);
        return res.render("checkouts", {
            products,
            provinces: provincesData,
            formatMoney: helper.formatToMoney
        });
    }

    // [GET] /checkouts/province-api
    loadProvinceData(req, res) {
        return res.json(provincesData);
    }

    // [GET] /checkouts/payment
    async payment(req, res) {
        let userId = req.userID;
        let products = await cartController.getCartProduct(userId);
        
        return res.render("checkout-payment", {
            products,
            provinces: provincesData,
            formatMoney: helper.formatToMoney
        });
    }

    // [POST] /checkouts
    async addNewOrder(req, res) {
        const userID = req.userID;
        const orderDetail = req.body;

        let {username,phonenumber,address, email, note, isPaymentOnline,products} = req.body;
        let { province,district,ward, detail} = address;
        let orderCode = generateOrderCode();
        let status = {
            key:"inWaitConfirm",
            value: true
        }

        username = (String(username).replaceAll(" ","")).length < 1 ? (await userModel.findOne({_id:userID}).username) : username;

        let order = await orderModel.findOne({userID});
        if(order){
            order.orders.push(
                {
                    orderCode,
                    username,
                    products,
                    phonenumber,
                    address: { 
                        province,
                        district,
                        ward,
                        detail
                    },
                    note,
                    isPaymentOnline,
                    status:[
                        status
                    ]
                }
            )
            await order.save();
        }else{
            order = await new orderModel({
                userID,
                orders:[
                    {
                        orderCode,
                        username,
                        products,
                        phonenumber,
                        address: { 
                            province,
                            district,
                            ward,
                            detail
                        },
                        note,
                        isPaymentOnline,
                        status:[
                            status
                        ]
                    }
                ]
            }).save();
        }
        return res.status(200).json({orderCode}).end();
    }

    // [GET] /checkouts/order
    async order(req, res) {
        let userID = req.userID;
        let products = await cartController.getCartProduct(userID);
        let orderCode = req.params.orderCode;

        let orderData = await orderModel.findOne({userID, "orders.orderCode":orderCode});
        if(!orderData) return res.redirect("/gio-hang");

        let order = orderData.orders.filter(function(value,index){
            if(value.orderCode == orderCode){
                return value;
            }
        })[0]

        
        let productIDList = [];
       
        order.products.forEach(function(value,index){
            productIDList.push(String(value.productID));
        })

        let totalBill = 0;
        let totalProduct = 0;
        let productOrders = products.cartProducts.filter(function(value, index){
            if(productIDList.includes(String(value.productID))){
                totalBill += ((value.totalPrice) * (value.quantity));
                totalProduct += (value.quantity);
                return value;
            }
        })
       

        // Detele Product had bought In Cart
        let card = await shoppingCartModel.findOne({userID});
        card.products = card.products.filter(function(product,index){
            // Get product that not in order
            if(!productIDList.includes(String(product.productID))){
                return product
            }
        })
        await card.save();

        // Addition data
        products.productOrders = productOrders;
        products.totalBill = totalBill;
        products.totalProduct = totalProduct;
        // console.log(orderData);
        
        return res.render("checkout-order", {
            products,
            orderInfo: orderData.orders[0],
            formatMoney: helper.formatToMoney
        });
    }

}

module.exports = new checkoutController();