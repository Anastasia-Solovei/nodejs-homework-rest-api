const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { ValidContactName } = require("../../config/constants");

const schemaContact = Joi.object({
  name: Joi.string()
    .min(ValidContactName.MIN_LENGTH)
    .max(ValidContactName.MAX_LENGTH)
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^[(][0-9]{3}[)][ ]{0,1}[0-9]{3}[-][0-9]{4}$/)
    .required(),
  favorite: Joi.boolean().optional(),
});

const schemaId = Joi.object({
  contactId: Joi.objectId().required(),
});

const schemaStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, obj, res, next) => {
  try {
    if (Object.keys(obj).length === 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "missing fields",
      });
    }
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: `missing required field, ${err.message.replace(/"/g, "")}`,
    });
  }
};

module.exports.validateContact = async (req, res, next) => {
  return await validate(schemaContact, req.body, res, next);
};

module.exports.validateId = async (req, res, next) => {
  return await validate(schemaId, req.params, res, next);
};

module.exports.validateStatusContact = async (req, res, next) => {
  return await validate(schemaStatusContact, req.body, res, next);
};
