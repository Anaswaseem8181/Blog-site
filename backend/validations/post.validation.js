const Joi = require("joi");

const createPostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  content: Joi.string().trim().min(10).required(),
  coverImage: Joi.string().uri().allow(null, ''),
  status: Joi.string().valid('draft', 'published').default('published'),
  tags: Joi.array().items(Joi.string().trim().max(50)).optional(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).not(""),
  content: Joi.string().trim().min(10).not(""),
  coverImage: Joi.string().uri().allow(null, ''),
  status: Joi.string().valid('draft', 'published'),
  tags: Joi.array().items(Joi.string().trim().max(50)).optional(),
}).min(1);

module.exports = {
  createPostSchema,
  updatePostSchema,
};
