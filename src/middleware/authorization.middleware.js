import { User } from "../db/models/user.model.js";
import { messages } from "../utils/index.js";

export const isAuthorized = () => {
    return async (req, res, next) =>{ 
        const userExist = await User.findOne({email: req.body.email})
        
        if (userExist.blockUser.includes(req.userExist.email)) return next(new Error(messages.USER.notAuthorized,{cause: 401}));
        return next()
    }
}