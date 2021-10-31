const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
// const { ValidContactName } = require("../../config/constants");
const { HttpCode } = require("../../config/constants");

const schemaUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validate = async (schema, obj, res, next) => {
  try {
    if (Object.keys(obj).length === 0) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "missing fields",
      });
    }
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: `missing required field, ${err.message.replace(/"/g, "")}`,
    });
  }
};

module.exports.validateUser = async (req, res, next) => {
  return await validate(schemaUser, req.body, res, next);
};
