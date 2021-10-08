const Joi = require("joi");

// const patternId = "\\w{8}-\\{4}-\\{4}-\\{4}-\\{12}";
// const patternPhone =
// "^([0-9]{3})s*(?:[ ]s*)?([0-9]{3})s*(?:[.-]s*)?([0-9]{4})$";

const schemaContact = Joi.object({
  name: Joi.string().alphanum().min(1).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    // .pattern(new RegExp(patternPhone))
    .regex(/^[(][0-9]{3}[)][ ]{0,1}[0-9]{3}[-][0-9]{4}$/)
    .required(),
});

const schemaId = Joi.object({
  id: Joi.string()
    // .pattern(new RegExp(patternId))
    .required(),
});

const validate = async (schema, obj, res, next) => {
  try {
    if (!obj.id) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "contact with entered id not found!",
      });
    }

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
    console.log(err);
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
