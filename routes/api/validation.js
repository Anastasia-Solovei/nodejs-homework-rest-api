const Joi = require("joi");

const schemaContact = Joi.object({
  name: Joi.string().alphanum().min(1).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^([0-9]{3})\s*(?:[ ]\s*)?([0-9]{3})\s*(?:[.-]\s*)?([0-9]{4})$/)
    .required(),
});

const validate = async (schema, obj, res, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    console.log(err.message);
    res.json({
      status: "error",
      code: 400,
      message: `missing required field`,
    });
  }
};

module.exports.validateContact = async (req, res, next) => {
  return await validate(schemaContact, req.body, res, next);
};
