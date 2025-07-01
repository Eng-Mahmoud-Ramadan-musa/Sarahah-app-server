import Joi from "joi";
import { genders } from "../../db/models/index.js";

export const updated = Joi.object({
  password: Joi.string().allow(null, '').optional(),
  userName: Joi.string().required().min(5).max(15).messages({
    "string.min": "Username must be at least 5 characters",
    "string.max": "Username cannot exceed 15 characters",
  }),
  phone: Joi.string().optional(),
  dob: Joi.date().allow(null, '').optional().messages({
    "date.base": "Invalid date format",
  }),
  gender: Joi.string()
    .valid(...Object.values(genders))
    .allow(null, '').optional()
    .default(genders.MALE)
    .messages({
      "any.only": "Gender must be either 'male' or 'female'",
    }),
  image: Joi.string().allow(null, '').optional(),
}).required();