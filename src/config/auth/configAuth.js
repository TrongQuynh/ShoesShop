const path = require("path");
require('dotenv').config({
    path: path.resolve(__dirname, '../../../.env')
});

module.exports = {
    "googleAuth": {
        "clientID": "196668056579-lbo4uq4rgtf50rlg1vgme4ahghb9ujgd.apps.googleusercontent.com",
        "clientSecret": "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",
        "callbackURL": `${process.env.DOMAIN_NAME_DEPLOY}/accounts/auth/google/callback`
    }
}