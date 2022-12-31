const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const slug = require('mongoose-slug-generator')

const Schema = mongoose.Schema;

// Create Schema
const productSchema = new Schema({
    productName: { type: String, default: "" },
    productImgs: { type: Array },
    newPrice: Number,
    quantity: { type: Number, default: 0 },
    oldPrice: String,
    discount: Number,
    isHotProduct: Boolean,
    isNewProduct: Boolean,
    productSize: { type: Array },
    productCode: String,
    productType: String,
    note: String,
    status: Boolean,
    slug: { type: String, slug: 'productName', unique: true }
}, { timestamps: true });


// Query helper
productSchema.query.getHotProduct = function () {
    return this.find({ isHotProduct: true });
}

productSchema.query.getNewProduct = function () {
    return this.find({ isNewProduct: true });
}

productSchema.query.getDiscountProduct = function () {
    return this.find().where('discount').gt(0);
}

productSchema.query.getProductByType = function (type) {
    return this.find({ productType: type })
}

productSchema.query.searchProductByName = function (text) {
    // return this.where({ name: new RegExp(name, 'i') });
    return this.find({ productName: { $regex: '.*' + text + '.*' } }).where();
}

productSchema.query.fillterProductBySize = function (size) {
    return this.find({ "productSize": size });
}

productSchema.query.fillterProductByPrice = function (rangePrice) {
    return this.where("newPrice").gte(Number(rangePrice[0])).lte(Number(rangePrice[1]));
}

productSchema.query.sortable = function (sortBy, sortValue) {
    return sortBy == "Name" ? this.sort({ productName: sortValue }) : this.sort({ newPrice: sortValue });
}

// Add Plugin
mongoose.plugin(slug)
productSchema.plugin(mongoose_delete, { overrideMethods: true });
productSchema.plugin(mongoose_delete);

const products = mongoose.model("products", productSchema);

module.exports = products;