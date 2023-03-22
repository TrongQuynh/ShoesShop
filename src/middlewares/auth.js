const ACCESS_SECRET_KEY = "VEwINQKT4ws1NWT0rNOedowpJf5JM7zCe9ZTlcGMe0RW70U8PCoWbIl9BsSazMQ";
const jwtHelper = require("../helpers/jwt");

// Model
const CartModel = require("../models/shoppingCart.model");
const userModel = require("../models/user.model");


// check if accesstoken is valid or not

const getUserID = async function (req) {
    const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.accsessToken;
    if (tokenFromClient) {
        try {
            let decoded = await jwtHelper.verifyJWT(tokenFromClient, ACCESS_SECRET_KEY);
            let expireTime = decoded.exp;
            req.userID = decoded.id;
            console.log("Auth.js - getUserID: " + req.userID);
            return decoded.id;
        } catch (error) {
            return res.json({ "message": "Error Token" });
        }
    } else {
        if (req.isAuthenticated()) {
            req.userID = req.user._id;
            return;
        } else {
            req.userID = "";
            return;
        }
    }
}

const isValidateToken = async function (req) {
    const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.accsessToken;
    if (tokenFromClient) {
        try {
            let decoded = await jwtHelper.verifyJWT(tokenFromClient, ACCESS_SECRET_KEY);
            let expireTime = decoded.exp;
            req.userID = decoded.id;
            let now = ((new Date()).getTime()) / 1000;
            if (now > expireTime) {
                // Token is expireds
                return false;
            }
            return true;
        } catch (error) {
            return res.json({ "message": "Hello Error" })
        }
    }
    return false;
}

const isHaveToken = function (req) {
    const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.accsessToken;
    return tokenFromClient ? true : false;
}

// for url need login
const isAuth = async function (req, res, next) {
    if (req.isAuthenticated()) {
        // Check for login by oauth
        req.userID = (req.user._id).toString();
        return next();
    }

    if (!isHaveToken(req)) {
        // if not have token
        return res.redirect("/accounts/login");
    }
    if (req.isAuth) {
        // Tokem is valid
        return next();
    } else {
        // Tokem is expired
        return res.json({ message: "Token is expired" }).end();
    }

}

const userData = async function (req, res, next) {
    // get info of current User
    if (req.userID == "") {
        req.userData = null
        return next()
    }
    let data = await userModel.findOne({ _id: req.userID });
    console.log("Auth.js - userData: " + data.username);
    let userData = {
        username: data.username,
        phonenumber: data.phonenumber,
        picture: data.picture,
        role: data.role
    }
    req.userData = userData;
    return next();
}

const isAdmin = function(req,res,next){
    if(req.userData.role == 0){
        return res.status(401).json({"status": 401});
    }else{
        return next();
    }
}

const isLogin = async function (req) {

    if (req.isAuthenticated() || await isValidateToken(req)) {
        // if is login by username-pwd or Oauth2
        return true;
    }
    return false;
}

const isNotNeedLogin = function (req, res, next) {
    req.noNeedLogin = true;
    return next();
}

const handleRequest = async function (req, res, next) {

    if (req.originalUrl == "/accounts/logout") {
        // if is request log out
        return next();
    }

    // if user had login but still request login
    if (String(req.originalUrl).includes("/accounts/")) {
        if (await isLogin(req)) {
            return res.redirect("/");
        }
        return next();
    }

    // Request NOT need login
    if (req.noNeedLogin) {
        if (await isLogin(req)) {
            await getUserID(req);
        } else {
            req.userID = "";
        }
        return next()
    }

    // Request need login
    // if have token but token is expired
    if (isHaveToken(req) && !await isValidateToken(req)) {
        // return res.status(400).send("Token is expired");
        return res.status(400).render("login");
    }


    if (await isLogin(req)) {
        console.log("Use has login => get data => Next");
        await getUserID(req);
        return next();
    } else {
        /*
            Router will go there
            * user
            * gio-hang
        */
            console.log("Use No login");
        if(req.method == "GET"){
            return res.render("404");
        }
        return res.json({ "status": 401 });
    }
}

const isHaveProductInCart = async function (req, res, next) {
    let cart = await CartModel.findOne({ userId: req.userID }).lean();
    let amountProduct = 0;
    if (cart) {
        amountProduct = cart.products.length;
    }
    return amountProduct < 1 ? res.redirect("/gio-hang") : next();
}

module.exports = { userData, isHaveProductInCart, handleRequest, isNotNeedLogin, isAdmin };