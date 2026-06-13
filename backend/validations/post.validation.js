const Joi = require("joi");

const createPostSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .required(),

  content: Joi.string()
    .trim()
    .min(10)
    .required(),
});

module.exports = {
  createPostSchema,
};