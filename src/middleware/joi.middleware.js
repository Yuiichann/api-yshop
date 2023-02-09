import Joi from 'joi';
import responseHandler from '../handlers/response.handler.js';

const ValidateJoi = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);

      next();
    } catch (error) {
      responseHandler.unprocessableEntity(res, error.details);
    }
  };
};

const validateSchema = {
  user: {
    signUp: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      displayName: Joi.string().required(),
    }),

    signIn: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
};

export { validateSchema, ValidateJoi };
