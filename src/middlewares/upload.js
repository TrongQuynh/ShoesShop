
const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("Here");
        req.body = JSON.parse(JSON.stringify(req.body));

        cb(null, './src/public/uploads');
    },
    filename: function (req, file, cb) {
        let fullPath = file.fieldname + '-' + Date.now() + path.extname(file.originalname);

        console.log(fullPath);
        req.body.avatar = "/uploads/" + fullPath;
        cb(null, fullPath);
    },
});

let upload = multer({ storage: storage });

module.exports = upload;