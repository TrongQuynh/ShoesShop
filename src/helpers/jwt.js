var jwt = require('jsonwebtoken');

exports.generatorJWT = function(payload, secretKey, tokenLife){
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    try {
        return new Promise((resolve, reject)=>{
            jwt.sign(
                payload,
                secretKey,
                { 
                    algorithm: "HS256",
                    expiresIn: tokenLife
                },
                function(err, token){
                    if(err){
                        reject(err)
                    }
                    resolve(token)
                }
            );
        }) 
    } catch (error) {
        console.log(error);
    }
}

exports.verifyJWT = function(token,secretKey){
    // jwt.verify(token, secretOrPublicKey, [options, callback])
    try {
        return new Promise((resolve, reject)=>{
            jwt.verify(token, secretKey, {ignoreExpiration: true,}, (err,decoded) =>{
                if(err){
                    reject(err)
                }
                resolve(decoded)
            })
        })
    } catch (error) {
        return res.json(error);
    }
}