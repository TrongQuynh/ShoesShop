

const helperData = require("../helpers/data");

//  MODEL
const orderModel = require("../models/order.model");
const shoppingCartModel = require("../models/shoppingCart.model");
const productModel = require("../models/products.model");

const cartController = require("../controllers/shoppingCart-controller");
const helper = require("../helpers/index");




module.exports = {

    // [GET] /user/purchase?type
    async purchase(req, res, next) {
        let userID = req.userID;
        let reqType = req.query.status;
        if(!reqType){
            // GET ALL PRODUCT
            reqType = 0;
        }
        
        let reqStatus = {};
        reqStatus.number = parseInt(reqType);
        switch(parseInt(reqType)){
            case 1:
                reqStatus.key =  "inWaitConfirm";
                reqStatus.value = true;
            break;
            case 2:
                // In PREPARE stage
                reqStatus.key =  "inPrepareOrder";
                reqStatus.value = true;
            break;
            case 3:
                // In DELIVERY stage
                reqStatus.key =  "inDeliveryOrder";
                reqStatus.value = true;
            break;
            case 4:
                // In SUCCESS stage
                reqStatus.key =  "Success";
                reqStatus.value = true;
            break;
            case 5:
                // In CANCEL stage
                reqStatus.key =  "isOrderCancel";
                reqStatus.value = true;
            break;
        }

        // Get data of product in cart
        let cartProduct = userID == "" ? { cartProducts: [], totalBill: 0 } : await cartController.getCartProduct(userID);

        let userOrder = await orderModel.findOne({userID});
        let purchases = [];
        if (userOrder) {
            // if have this user
            if(reqType == 0){
                purchases = await helperData.getAllOrderDetail([userOrder],reqStatus);
            }else{
                purchases = await helperData.getOrderDetailWithStatus([userOrder],reqStatus);
            }
        }
        
        return res.render("purchase", {
            purchases,
            cartProduct,
            userData: req.userData,
            formatMoney: helper.formatToMoney
        })
    },

    // [POST] /user/repurchase
    async repurchase(req,res){
        let userID = req.userID;
        let {orderCode} = req.body;

        let userOrder = await orderModel.findOne({userID});
        if(userOrder){
            for(let order of userOrder.orders){
                if(order.orderCode == orderCode){
                    for(let product of order.products){
                        const {productID, quantity, size } = product;
                        let cart = await shoppingCartModel.findOne({ userID });
                        if (cart) {
                            cart.products.push({productID, quantity, size});
                            cart = await cart.save();
                        } else {
                            await new shoppingCartModel({
                                userID,
                                products: [{ productID, quantity, size }]
                            }).save();
                        }
                    }
                }
            }
        }else{

        }
        return res.status(200).end();
    }
}