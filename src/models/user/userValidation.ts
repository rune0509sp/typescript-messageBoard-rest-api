import Joi from '@hapi/joi';

export const passwordReg: RegExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

export const userSignupValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().regex(passwordReg).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userName: Joi.string().required(),
});
