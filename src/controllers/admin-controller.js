
// Model
const productModel = require("../models/products.model");
const orderModel = require("../models/order.model");

// Middleware
const upload_middleware = require("../middlewares/upload");

// Helper
const helper = require("../helpers/index");
const helperData = require("../helpers/data");

class adminController {

    // [GET] /quan-ly/san-pham-moi
    async showNewProductPage(req, res) {
        return res.render("newProduct")
    }

    // [POST] /quan-ly/san-pham-moi
    async newProduct(req, res, next) {
        let upload = upload_middleware.array("productImage", 6);
        upload(req, res, async function (err) {
            console.log(req.files)
            if (err) {
                console.log(err);
            }
            console.log("Request New Product");
           
            // console.log(JSON.parse(JSON.stringify(req.body)));
            let productData = JSON.parse(JSON.stringify(req.body));
            let productSize = String(productData.productSizes).split(",");
            let productCode = (String(productData.productCode).replaceAll(" ","")).length < 1 ? helperData.generateProductCode() :productData.productCode;
            let slug = helperData.generateProductSlug(productData.productName,productCode);
            let productImgs = [];
            (req.files).forEach(function(image){
                productImgs.push(image.filename);
            })
            let newProduct = await new productModel({
                productName: productData.productName,
                productImgs,
                newPrice: productData.productPrice,
                quantity: productData.quantity,
                discount: 0,
                productSize,
                productCode,
                // productType: String,
                note: productData.note,
                slug
            })
            console.log(newProduct);
            return res.json(JSON.stringify(req.body))
        });
    }

    // [GET] /quan-ly/quan-ly-san-pham
    async showProductManagementPage(req, res) {
        let products = await productModel.find();
        return res.render("product-management", {
            "products": products,
            "formatToMoney": helper.formatToMoney
        });
    }

    // [GET] /quan-ly/quan-ly-don-hang?status
    async showOrderManagementPage(req,res){
        let queryStr = req.query.status;
        if(!queryStr){
            queryStr = 0;
        }
        // console.log("queryStr: " + queryStr);
        let userOrders = await orderModel.find({});

        let reqStatus = {};
        reqStatus.number = parseInt(queryStr);
        switch(parseInt(queryStr)){
            case 0:
                reqStatus.key =  "inWaitConfirm";
                reqStatus.value = true;
            break;
            case 1:
                // In PREPARE stage
                reqStatus.key =  "inPrepareOrder";
                reqStatus.value = true;
            break;
            case 2:
                // In DELIVERY stage
                reqStatus.key =  "inDeliveryOrder";
                reqStatus.value = true;
            break;
            case 3:
                // In DELIVERY stage
                reqStatus.key =  "Success";
                reqStatus.value = true;
            break;
            case 4:
                // In DELIVERY stage
                reqStatus.key =  "isOrderCancel";
                reqStatus.value = true;
            break;
        }

        let orders = [];
        /*
            [{
                orderCode,
                username,
                products:[
                    {
                        productname,
                        size,
                        qunatity,
                        picture,
                        price
                    }
                ],]
                createAt,
                note,
                status

            }]
        */
 
        orders = await helperData.getOrderDetailWithStatus(userOrders,reqStatus);
        return res.render("order-management",{
            orders
        });
    }

    // [POST] /quan-ly/cap-nhap-tinh-trang
    async updateOrderStage(req,res){
        let {userID,orderCode,status} = req.body;
        status.date = Date.now();
        // let userID = "63b260b953fae62c0336139d";
        // console.log(status);

        let user = await orderModel.findOne({userID});
        let isHaveStatus = false;
        let isHaveOrder = false;

        user.orders.map(function(order,index){
            if(order.orderCode == orderCode){
                order.status.map(function(s){
                    if(s.key == status.key){
                        s.value = status.value;
                        s.date = status.date;
                        isHaveStatus = true;
                    }else{
                        s.value = false;
                    }
                    return s;
                })
                if(!isHaveStatus){
                    order.status.push(status);
                }
            }
            return order;
        })

        // console.log(user.orders[0].status);

        await user.save();

        // Object.keys(empty).length === 0 && empty.constructor === Object
        
        return res.json(user);

    }


    // [GET] /quan-ly/
    showAdminPage(req, res) {
        return res.render("admin");
    }
}

module.exports = new adminController();