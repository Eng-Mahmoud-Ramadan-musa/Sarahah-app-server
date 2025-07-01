import Joi from "joi";

export const sendMessage = Joi.object({
    content: Joi.string().required().max(50).messages({
        'string.empty': 'Content cannot be empty.',
        'string.max': 'Content cannot exceed 50 characters.',
        'any.required': 'Content is required.',
    }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.email": "Invalid email format",
          "string.empty": "Email is required",
        }),
    hidden: Joi.boolean().allow(null, '').default(false).optional(),
}).required();
