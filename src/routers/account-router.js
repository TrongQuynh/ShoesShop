const express = require('express');
const router = express.Router();
const passport = require('passport');
const Oauth = require("../middlewares/oauth");

// Controller
const accountController = require("../controllers/account-controller");
const oauthController = require("../controllers/oauth-controller");

// [GET] /accounts
router.get("/login", accountController.showLoginForm);
router.get("/register", accountController.showRegisterForm);

router.post("/login", accountController.login);
router.post("/register", accountController.register);
router.post("/refresh-token", accountController.refreshToken);

router.post("/logout", accountController.logout);

// GG Oauth
router.get('/auth/google', function (req, res, next) {
    Oauth.googleOauth(passport);
    return next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', function (req, res, next) {
    Oauth.googleOauth(passport);
    return next();
}, passport.authenticate('google', { failureRedirect: '/accounts/login' }), oauthController.loginGG);



module.exports = router;