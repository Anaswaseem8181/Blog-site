const Joi = require("joi");

const createCommentSchema = Joi.object({
  text: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required(),

  postId: Joi.number()
    .integer()
    .positive()
    .required(),

  parentCommentId: Joi.number()
    .integer()
    .positive()
    .optional(),
});

module.exports = {
  createCommentSchema,
};