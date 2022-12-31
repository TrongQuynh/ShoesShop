const Joi = require("joi");

exports.registerDataValidator = data => {
    const schema = Joi.object({
        phonenumber: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
        address: Joi.string(),
        username: Joi.string().min(6).required(),
        password: Joi.string().min(3).required(),
        email: Joi.string().min(10).required().email(),
    });
    return schema.validate(data);
}

exports.loginDataValidator = data => {
    const schema = Joi.object({
        phonenumber: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
        password: Joi.string().min(3).required(),
    });
    return schema.validate(data);
}

exports.productInfoValidator = data => {
    return Joi.object({
        productName: Joi.string().required(),
        productImgs: Joi.array(),
        newPrice: Joi.number(),
        discount: Joi.number(),
        productSize: Joi.array().min(1),
        productCode: Joi.string()
    }).validate(data);
}