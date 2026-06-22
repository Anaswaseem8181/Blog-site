const Joi = require("joi");

const createPostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),

  content: Joi.string().trim().min(10).required(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).not(""),
  content: Joi.string().trim().min(10).not(""),
}).min(1);

module.exports = {
  createPostSchema,
  updatePostSchema,
};
