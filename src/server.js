const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 8080;
const router = require("./routers/index");
const db = require("./config/db");
const cookieParser = require('cookie-parser')
var session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
let app = express();

app.use(cookieParser())

app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
    cookie: { secure: false }
}));

app.use(passport.session());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// Set view Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser (Express 4.16+)
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set DB
db.connect;

// Set public
app.use(express.static(path.join(__dirname, "public")));

//  Set Router
router(app);

app.listen(PORT, () => {
    console.log("1.Server run success");
})