const billModel = require("../models/bill.model");
const productModel = require("../models/products.model");

let totalMoney = 0;

async function addDataProduct(product) {
    console.log("Debug 5: ");
    
    let productDetail = await productModel.findOne({ productCode: product.productCode });
    console.log(productDetail);
    product["productName"] = productDetail.productName;
    product["picture"] = productDetail.productImgs[0];
    product["price"] = productDetail.newPrice;
    product["slug"] = productDetail.slug;
    totalMoney = product.quantity * productDetail.newPrice;
    return product;
}

async function updateOrder(order){
    let products = [];
    for(let product of order.products){
        products.push(await addDataProduct(product));
    }
    return products;
}

module.exports = {
    formatToMoney(number, type) {
        // 'it-IT' => VND
        // 'vi-VN' => ₫
        let location = type == "D" || !type ? 'vi-VN' : 'it-IT';
        return new Intl.NumberFormat(location, { style: 'currency', currency: 'VND' }).format(number);
    },
    formatDateToTime(date){
        let hour = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
        let time = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
        return `${hour}:${time}`;
    },
    formatDate(date){
        let month = (date.getMonth() + 1);
        let day = date.getDate();
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
        return `${day}-${month}-${date.getFullYear()}`;
    }
    ,
    async getProductBill(orders) {
        let newOrders = [];
        for(let order of orders){
            totalMoney = 0;
            newOrders.push({
                orderID: order.orderID,
                products:await updateOrder(order),
                totalMoney,
                dateOrder:this.formatDate(order.date),
                timeOrder:this.formatDateToTime(order.date),
            });
        }
        return newOrders;
    }

}