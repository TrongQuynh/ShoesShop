
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const configAuth = require("../config/auth/configAuth");

// Model
const userModel = require("../models/user.model");

class Oauth {
    googleOauth(passport) {
        // output of new GoogleStrategy is input of serializeUser
        // output of serializeUser is input of deserializeUser
        passport.serializeUser((user, done) => {
            // save user data in session
            // req.session.passport.user = user
            done(null, user.google.id);
        });

        passport.deserializeUser(async (id, done) => {
            // after this function can use req.user
            let user = await userModel.findOne({"google.id" : id});
            done(null, user);
        });

        passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL
          },
          async function(accessToken, refreshToken, profile, done) {
            let user = await userModel.findOne({"google.id" : profile.id});
            if(user){
                return done(null, user);
            }else{  
                let newUser = await new userModel({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    picture: profile.photos[0].value,
                    google: {
                        id: profile.id,
                        token: accessToken
                    }
                }).save();
                return done(null, newUser);
            }
          }
        ));
    }
}

module.exports = new Oauth();