import { Message, User } from "../../db/models/index.js";
import { emailEmitter, messages } from "../../utils/index.js";

export const getAllMessage = async (req, res, next) => {
    
    const getAllMessages = await Message.find({
        $or: [
            { sender: req.userExist._id },
            { receiver: req.userExist._id }
        ],
        deletedAt: null
    }).populate("sender", "userName email gender");

    return res.status(200).json({
        success: true,
        data: getAllMessages
    });
};

export const getAllMessageSender = async (req, res, next) => {
    const getAllMessages = await Message.find({ sender: req.userExist._id , deletedAt: null}).populate("sender", "userName email gender");

    return res.status(200).json({
        success: true,
        data: getAllMessages
    });
};

export const getAllMessageReceiver = async (req, res, next) => {
    
    const getAllMessages = await Message.find({ receiver: req.userExist._id , deletedAt: null}).populate("sender", "userName email gender");

    return res.status(200).json({
        success: true,
        data: getAllMessages
    });
};

export const getAllMessageFavorite = async (req, res, next) => {
    
    const getAllMessages = await Message.find({ $or: [
        { sender: req.userExist._id },
        { receiver: req.userExist._id }
    ],favorite: true}).populate("sender", "userName email gender");

    return res.status(200).json({
        success: true,
        data: getAllMessages
    });
};

export const sendMessage = async (req, res, next) => {
    const {content , email, hidden} = req.body;
    const receiverExist = await User.findOne({email});
    if (!receiverExist) return next(new Error(messages.USER.notFound,{cause: 404}));
    const createdMessage =  await Message.create({content, receiver: receiverExist._id, sender: req.userExist._id, hidden});
    emailEmitter.emit('message:sent', receiverExist.email, 'receive message from sarahah by ', req.userExist.userName, createdMessage.content);
    return res
    .status(201).
    json({success: true , message: messages.MESSAGE.createdSuccessfully, data: createdMessage})
};

export const addOrRemoveToFavorite = async (req, res, next) => {
    const id = req.params.id;
    
    const message = await Message.findById(id)
    if (!message) return res.status(404).json({success: false,message: messages.MESSAGE.notFound})
    message.favorite = !message.favorite;
    await message.save()
    return res
    .status(200).
    json({success: true, message: messages.MESSAGE.updatedSuccessfully})

};

export const deleteMessage = async (req, res, next) => {
    const result = await Message.deleteOne({sender: req.userExist._id , _id: req.params.id})
    if (result.deletedCount == 0) return next(new Error("note authorized this message", {cause:404}))

    return res.status(200).json({success: true, message: messages.MESSAGE.deletedSuccessfully})
};

export const deleteAllMessage = async (req, res, next) => {
   
    const result = await Message.deleteMany({
        $or: [
            { sender: req.userExist._id },
            { receiver: req.userExist._id }
        ],
        deletedAt: { $ne: null } // التحقق من أن deletedAt ليس null
    });
    
 if (result.deletedCount < 1) return next(new Error(messages.MESSAGE.notFound, {cause:404}))
 return res.status(200).json({success: true, message: messages.MESSAGE.deletedSuccessfully})
}

export const getArchiveAllMessage = async (req, res, next) => {
    const result = await Message.find({$or: [
        { sender: req.userExist._id },
        { receiver: req.userExist._id }
    ], deletedAt: { $ne: null }}).populate("sender", "userName email gender")
 return res.status(200).json({success: true, message: 'this messages all from archive',data: result})

};

export const archiveOrRestoreMessage = async (req, res, next) => {
    const id = req.params.id;
    const message = await Message.findById(id)
    if (!message) return res.status(404).json({success: false,message: messages.MESSAGE.notFound})
    message.deletedAt = message.deletedAt ? null : new Date();
    message.favorite = false;
    await message.save()
    return res.status(200).json({success: true, message: messages.MESSAGE.updatedSuccessfully})

};

export const archiveAllMessage = async (req, res, next) => {
    const result = await Message.updateMany({        
        $or: [
        { sender: req.userExist._id },
        { receiver: req.userExist._id }
    ],deletedAt: null},{$set: {deletedAt: new Date()}})
    if(result.matchedCount  < 1) return next(new Error('No messages available for archiving.'))
 return res.status(200).json({success: true, message: "An error occurred while archiving messages."})

};

export const restoreAllMessage = async (req, res, next) => {
    const result = await Message.updateMany({    $or: [
        { sender: req.userExist._id },
        { receiver: req.userExist._id }
    ],
    deletedAt: { $ne: null }},{$set: {deletedAt: null}})
    if(result.matchedCount  < 1) return next(new Error('No messages available for archiving.'))
 return res.status(200).json({success: true, message: "An error occurred while archiving messages."})

};