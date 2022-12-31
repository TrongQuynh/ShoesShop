const billModel = require("../models/bill.model");
const productModel = require("../models/products.model");

(async function getProductBill(){
    let bill = await billModel.findOne({userID:"631445ed4646669d13a68954"});
    let orders = bill.orders;
    console.log(orders);
    // let result = await orders.map(async function(order){
    //     return await order.products.map(async function(product){
    //         let productDetail = await productModel.findOne({productCode:product.productCode});
    //         product["productName"] = productDetail.productName;
    //         product["picture"] = productDetail.productImgs[0];
    //         return product;
    //     })
    // })
    // console.log(result);
})();