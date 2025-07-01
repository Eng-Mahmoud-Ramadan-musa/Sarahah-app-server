import jwt from 'jsonwebtoken';

export const generateToken = ({payload, signature = process.env.SECRET_JWT , options = {}}) => {
    return jwt.sign(payload, signature , options)
};

export const verifyToken = ({payload, signature = process.env.SECRET_JWT , options = {}}) => {
   try {
        return jwt.verify(payload, signature, options)
   } catch (error) {
        return {error};
   }
}