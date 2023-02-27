import Joi from 'joi';
import responseHandler from '../handlers/response.handler.js';

const ValidateJoi = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);

      next();
    } catch (error) {
      responseHandler.unprocessableEntity(res, {
        err: error.details[0].message,
      });
    }
  };
};

const validateSchema = {
  user: {
    signUp: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      displayName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone_number: Joi.string()
        .regex(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
        .required(),
      address: Joi.object({
        province: Joi.string().required(),
        district: Joi.string().required(),
        ward: Joi.string().required(),
        detail: Joi.string().required(),
      }),
    }),

    signIn: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),

    updatePassword: Joi.object({
      password: Joi.string().required(),
      newPassword: Joi.string()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        .required(),
      confirm_newPassword: Joi.string().required(),
    }),
  },

  order: {
    create: Joi.object({
      address: Joi.object({
        province: Joi.string().required(),
        district: Joi.string().required(),
        ward: Joi.string().required(),
        detail: Joi.string().required(),
      }),
      phone_number: Joi.string()
        .regex(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
        .required(),
      products: Joi.array().items(
        Joi.object({
          figure_id: Joi.string().required(),
          quantity: Joi.number().integer().required(),
        })
      ),
    }),

    checkInStock: Joi.object({
      products: Joi.array().items(
        Joi.object({
          figure_id: Joi.string().required(),
          quantity: Joi.number().integer().required(),
        })
      ),
    }),
  },
};

export { validateSchema, ValidateJoi };
