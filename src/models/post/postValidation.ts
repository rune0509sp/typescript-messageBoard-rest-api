import Joi from '@hapi/joi';

export const createPostValidation = Joi.object({
  title: Joi.string().min(3).required(),
  text: Joi.string().min(10).required(),
});

export const updatePostValidation = Joi.object({
  title: Joi.string().min(3),
  text: Joi.string().min(10),
});
