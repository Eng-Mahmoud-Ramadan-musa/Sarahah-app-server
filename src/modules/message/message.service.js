import { Message, User } from "../../db/models/index.js";
import { emailEmitter, messages } from "../../utils/index.js";
import { handleResponse } from "../../utils/handleResponse.js";

export const getAllMessage = async (req, res, next) => {
  const getAllMessages = await Message.find({
    $or: [
      { sender: req.userExist._id },
      { receiver: req.userExist._id }
    ],
    _id: { $nin: req.userExist.archive },
  }).populate("sender", "userName email image gender");

  const formattedMessages = handleResponse(getAllMessages);
  const favorite = req.userExist.favorite;
  return res.status(200).json({ success: true, data: formattedMessages, favorite });
};

export const getAllMessageSender = async (req, res, next) => {
  const getAllMessages = await Message.find(
    { 
      sender: req.userExist._id,
      _id: { $nin: req.userExist.archive } 
    })
    .populate("sender", "userName email gender");
    const favorite = req.userExist.favorite;
  return res.status(200).json({ success: true, data: getAllMessages, favorite });
};

export const getAllMessageReceiver = async (req, res, next) => {
  const getAllMessages = await Message.find({ 
    receiver: req.userExist._id, 
    _id: { $nin: req.userExist.archive }, 
    })
    .populate("sender", "userName email gender image");

    const favorite = req.userExist.favorite;

  const formattedMessages = handleResponse(getAllMessages);
  return res.status(200).json({ success: true, data: formattedMessages, favorite });
};

export const getAllMessageFavorite = async (req, res, next) => {
    const getAllMessages = await Message.find({
      _id: { $in: req.userExist.favorite }
    }).populate("sender", "userName email image gender");

    const formattedMessages = handleResponse(getAllMessages);
    const favorite = req.userExist.favorite;
    return res.status(200).json({
      success: true,
      data: formattedMessages,
      favorite
    });
};

export const sendMessage = async (req, res, next) => {
  const { content, email, hidden } = req.body;
  const receiverExist = await User.findOne({ email });

  if (!receiverExist)
    return next(new Error(messages.USER.notFound, { cause: 404 }));

  const createdMessage = await Message.create({
    content,
    receiver: receiverExist._id,
    sender: req.userExist._id,
    hidden
  });

  emailEmitter.emit(
    'sendEmail',
    receiverExist.email,
    'receive message from sarahah by ',
    req.userExist.userName,
    createdMessage.content
  );

  return res.status(201).json({
    success: true,
    message: messages.MESSAGE.createdSuccessfully,
    data: createdMessage
  });
};

export const addOrRemoveToFavorite = async (req, res, next) => {
       const id = req.params.id;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: messages.MESSAGE.notFound,
      });
    }

    const favorites = req.userExist.favorite;
    const archive = req.userExist.archive;

    const favIndex = favorites.indexOf(id);

    if (favIndex !== -1) {
      // إذا كانت الرسالة في المفضلة → نحذفها
      favorites.splice(favIndex, 1);
    } else {
      // إذا لم تكن في المفضلة → نضيفها
      favorites.push(id);

      // نحذفها من الأرشيف إن كانت موجودة
      const archiveIndex = archive.indexOf(id);
      if (archiveIndex !== -1) {
        archive.splice(archiveIndex, 1);
      }
    }

    await req.userExist.save();

    return res.status(200).json({
      success: true,
      message: messages.MESSAGE.updatedSuccessfully,
      isFavorite: favIndex === -1, // إذا أضيفت الآن
    });
};

export const deleteMessage = async (req, res, next) => {
  const result = await Message.deleteOne({
    sender: req.userExist._id,
    _id: req.params.id
  });

  if (result.deletedCount === 0)
    return next(new Error("not authorized for this message", { cause: 404 }));

  return res.status(200).json({
    success: true,
    message: messages.MESSAGE.deletedSuccessfully
  });
};

export const deleteAllMessage = async (req, res, next) => {
  const result = await Message.deleteMany({
    $or: [
      { sender: req.userExist._id },
      { receiver: req.userExist._id }
    ],
    deletedAt: { $ne: null }
  });

  if (result.deletedCount < 1)
    return next(new Error(messages.MESSAGE.notFound, { cause: 404 }));

  return res.status(200).json({
    success: true,
    message: messages.MESSAGE.deletedSuccessfully
  });
};

export const getArchiveAllMessage = async (req, res, next) => {
    const messages = await Message.find({
      _id: { $in: req.userExist.archive },
    }).populate("sender receiver", "userName email image gender");

    const formattedMessages = handleResponse(messages);

    return res.status(200).json({
      success: true,
      message: 'All archived messages retrieved successfully.',
      data: formattedMessages,
    });
};

export const archiveOrRestoreMessage = async (req, res, next) => {
    const id = req.params.id;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: messages.MESSAGE.notFound,
      });
    }

    const favorites = req.userExist.favorite;
    const archive = req.userExist.archive;
    const index = archive.indexOf(id);

    if (index !== -1) {
      // إذا كانت موجودة → نحذفها
      archive.splice(index, 1);
    } else {
      // إذا لم تكن موجودة → نضيفها
      archive.push(id);
      const favoriteIndex = favorites.indexOf(id);
      if (favoriteIndex !== -1) {
        favorites.splice(favoriteIndex, 1);
      }
    }

    await req.userExist.save();

    return res.status(200).json({
      success: true,
      message: messages.MESSAGE.updatedSuccessfully,
      isFavorite: index === -1, // إذا تمت إضافتها الآن = true
    });
};

export const archiveAllMessage = async (req, res, next) => {
    // 1. جلب كل الرسائل التي المستخدم طرف فيها
    const allUserMessages = await Message.find({
      $or: [
        { sender: req.userExist._id },
        { receiver: req.userExist._id }
      ]
    });

    // 2. استخراج معرفات الرسائل
    const messageIds = allUserMessages.map(msg => msg._id.toString());

    // 3. حذف المكرر (لو كانت الرسالة مؤرشفة مسبقًا)
    const uniqueArchived = [...new Set([...req.userExist.archive.map(id => id.toString()), ...messageIds])];

    // 4. تحديث المستخدم بحقل archive
    req.userExist.archive = uniqueArchived;
    await req.userExist.save();
    const archivedMessages = await Message.find({
      _id: { $in: uniqueArchived }
    }).populate("sender", "userName email image gender");

    const formattedMessages = handleResponse(archivedMessages);
    return res.status(200).json({
      success: true,
      message: "All messages archived successfully.",
      data: formattedMessages
    });
};

export const restoreAllMessage = async (req, res, next) => {
    // تفريغ المصفوفة
    req.userExist.archive = [];

    // حفظ التعديلات
    await req.userExist.save();

    return res.status(200).json({
      success: true,
      message: "Archived messages cleared successfully.",
    });
};
