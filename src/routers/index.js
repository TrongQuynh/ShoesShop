
// Router
const productRouter = require("../routers/product-router");
const cartRouter = require("./shoppingCart-router");
const checkoutRouter = require("./checkouts-router");
const accountRouter = require("../routers/account-router");
const testRouter = require("../routers/test");
const userRouter = require("../routers/user-router");
const searchRouter = require("../routers/search-router");
const adminRouter = require("../routers/admin-router");

// Controller
const homeController = require("../controllers/home-controller");
const adminController = require("../controllers/admin-controller");

// Middleware
const authMiddleWare = require("../middlewares/auth");

function Router(app) {

    app.use("/test", adminController.showProductManagementPage);
    app.use("/test-api", testRouter);

    // need login
    app.use("/checkouts", authMiddleWare.handleRequest,
        authMiddleWare.userData, authMiddleWare.isHaveProductInCart, checkoutRouter);

    app.use("/quan-ly", authMiddleWare.handleRequest, authMiddleWare.userData, authMiddleWare.isAdmin,adminRouter);

    app.use("/gio-hang", authMiddleWare.handleRequest, authMiddleWare.userData, cartRouter);
    app.use("/accounts", authMiddleWare.handleRequest, accountRouter);
    app.use("/user", authMiddleWare.handleRequest, authMiddleWare.userData, userRouter);
    // Not need login
    app.use("/san-pham", authMiddleWare.isNotNeedLogin, authMiddleWare.handleRequest, authMiddleWare.userData, productRouter);
    app.use("/tim-kiem", searchRouter);
    // app.use("/", authMiddleWare.isValidateToken1, authMiddleWare.userData, homeController.showHomePage);
    app.use("/", authMiddleWare.isNotNeedLogin, authMiddleWare.handleRequest, homeController.showHomePage);



}

module.exports = Router;