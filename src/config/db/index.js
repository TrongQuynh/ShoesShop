const mongoose = require("mongoose");

let mongoDB = "mongodb://localhost:27017/HanShoes_DB";
let connect = mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("2.Connect DB Success!");
})
.catch(()=>{
    console.log("2.Connect DB Fail :(");
})
module.exports = {connect};