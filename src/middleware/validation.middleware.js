import { Types } from "mongoose";

export const isValid = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(req.body ,req.file, { abortEarly: false });
        if (result.error) {
            const messages = result.error.details.map((obj) => obj.message);
            return next(new Error(messages,{cause: 400}))
        }

        return next();
    };
};


  export const isValidId = (value, helpers) => {
          if (!Types.ObjectId.isValid(value)) return helpers.message("invalid id")
              return true;
      }
