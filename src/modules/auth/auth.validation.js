import Joi from "joi";
import { genders } from "../../db/models/index.js";

export const register = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      "any.only": "Confirm Password do not match Password",
      "string.empty": "Confirm Password is required",
    }),
  userName: Joi.string().min(5).max(15).required().messages({
    "string.min": "Username must be at least 5 characters",
    "string.max": "Username cannot exceed 15 characters",
    "string.empty": "Username is required",
  }),
  phone: Joi.string()
    .pattern(/^(002|\+2|)01[0-2,5][\d]{8}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid phone number format",
      "string.empty": "Phone number is required",
    }),
  dob: Joi.date().required().messages({
    "date.base": "Invalid date format",
    "date.empty": "Date of birth is required",
  }),
  gender: Joi.string()
    .valid(...Object.values(genders))
    .optional()
    .default(genders.MALE)
    .messages({
      "any.only": "Gender must be either 'male' or 'female'",
    }),
  image: Joi.string().optional(),
}).required();

export const login = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
}).required();

export const googleLogin = Joi.object({
  idToken: Joi.string().required().messages({
    "string.empty": "idToken is required",
  }),
}).required();

export const refreshToken = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      "string.empty": "refreshToken is required",
    }),
}).required()

export const verificationCodeSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
    subject: Joi.string().required().messages({
      "string.empty": "Email is required",
    })
}).required();

// sendCodeStep2faSchema
export const sendCodeStep2faSchema = Joi.object({
  content: Joi.alternatives().try(
    Joi.string()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": "Invalid email format",
        "string.empty": "Email or password is required",
      }),
    Joi.string()
      .pattern(/^(002|\+2)?01[0-2,5]\d{8}$/)
      .messages({
        "string.pattern.base": "Invalid phone format",
        "string.empty": "Email or password is required",
      })
  ),
}).required();

// loginWithStep2faSchema
export const loginWithStep2faSchema  = Joi.object({
  content: Joi.alternatives().try(
    Joi.string()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": "Invalid email format",
        "string.empty": "Email or password is required",
      }),
    Joi.string()
      .pattern(/^(002|\+2)?01[0-2,5]\d{8}$/)
      .messages({
        "string.pattern.base": "Invalid phone format",
        "string.empty": "Email or password is required",
      })
  ),
  code: Joi.string().length(6).required().messages({
    "string.min": "code must be at least 6 characters",
    "string.empty": "code is required",
  }),
}).required(); 

// updatePasswordSchema
export const updatePasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
  otp: Joi.string().length(6).required().messages({
    "string.min": "otp must be at least 6 characters",
    "string.empty": "otp is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "string.empty": "Confirm Password is required",
    }),
}).required();



