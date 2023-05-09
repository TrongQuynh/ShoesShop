const bcrypt = require('bcrypt');
const jwtHelper = require("../helpers/jwt");
// Model
const userModel = require("../models/user.model");
// validate
const { registerDataValidator, loginDataValidator } = require("../helpers/validate");

let tokenList = {};
let second = 1000;
let minute = second * 60;
const accessTokenLife = String(minute * 60);
const refreshTokenLife = "3650d";
const ACCESS_SECRET_KEY = "VEwINQKT4ws1NWT0rNOedowpJf5JM7zCe9ZTlcGMe0RW70U8PCoWbIl9BsSazMQ";
const REFRESH_SECRET_KEY = "213B7A9AD97B6F6B0BF8B97B915967A935320D72EC07716DE393E845FC1B7A5F";

class accountController {

    // [GET] accounts/login
    showLoginForm(req, res) {
        return res.render("login");
    }

    // [GET] accounts/register
    showRegisterForm(req, res) {
        return res.render("register");
    }

    // [POST] accounts/login
    async login(req, res) {
        let data = req.body;

        // Validate before check account in DB
        let { error } = loginDataValidator(data);
        if (error) return res.status(404).json(error.details[0].message);

        // find user by phonenumber
        let user = await userModel.findOne({ "phonenumber": data.phonenumber });
        if (!user) return res.status(404).json({ "message": "Not found user" });

        // Check if password is same
        let isPasswordSame = await bcrypt.compare(data.password, user.password);
        if (!isPasswordSame) return res.status(404).json({ "message": "Password error" });

        // Generator Token
        try {
            const accsessToken = await jwtHelper.generatorJWT(
                {
                    id: user._id,
                    username: user.username,
                    email: user.email
                },
                ACCESS_SECRET_KEY,
                accessTokenLife
            );
            const refreshToken = await jwtHelper.generatorJWT(
                {
                    username: user.username,
                    email: user.email
                },
                REFRESH_SECRET_KEY,
                refreshTokenLife
            );
            tokenList[refreshToken] = { accsessToken, refreshToken };
            return res.status(200).json({ accsessToken, refreshToken });
        } catch (error) {
            return res.status(500).json({ "message": "Token error" });
            // return res.send(error)
        }
    }

    // [POST] accounts/register
    async register(req, res) {
        let data = req.body;
        const saltRounds = 10;
        // VALIDATE DATA BEFORE WE ARE USER
        let { error } = registerDataValidator(data);
        console.log(error);
        if (error) return res.status(404).json({"message":error.details[0].message});

        // Check if account exsit
        let user = await userModel.findOne({ "phonenumber": data.phonenumber });
        if (user) return res.status(409).json({ "message": "User already exist" });
        // Hash password
        let hashPassword = await bcrypt.hash(data.password, saltRounds);
        // Create new user
        data.password = hashPassword;
        let newUser = await new userModel(data).save();
        return res.status(200).json({ "message": "Regster Successful!" });
    }

    // [POST] accounts/logout
    logout(req, res) {
        console.log("Log out request");
        let refreshToken = req.body.refreshToken;
        res.clearCookie("accsessToken");
        res.clearCookie("connect.sid");
        delete tokenList[refreshToken];

        return res.status(200).end();
    }

    // [POST] account/refresh-token
    async refreshToken(req, res) {
        let refreshTokenFromClient = req.body.refreshToken;
        if (refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
            try {
                let decoded = await jwtHelper.verifyJWT(refreshTokenFromClient, REFRESH_SECRET_KEY);
                let payload = {
                    username: decoded.username,
                    email: decoded.email
                }
                let newAccessToken = await jwtHelper.generatorJWT(payload, ACCESS_SECRET_KEY, accessTokenLife);
                return res.json({ newAccessToken });
            } catch (error) {
                return res.json({ "message": "Invalid Token" });
            }
        }
        return res.json({ "message": "Not found Token" });
    }
}

module.exports = new accountController();