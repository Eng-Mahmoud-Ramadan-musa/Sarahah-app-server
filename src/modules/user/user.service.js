import fs from "fs";
import { Message, User } from "../../db/models/index.js";
import { decrypt, encrypt, hash, messages } from "../../utils/index.js";
import { customAlphabet } from "nanoid";
import cloudinary from "../../utils/multer/cloud.config.js";

export const getProfile = async (req, res, next) => {
  const userExist = req.userExist;
  userExist.password = "";
  userExist.phone = decrypt({ cipherText: userExist.phone });
  return res.status(200).json({
    success: true,
    message: messages.USER.getProfileSuccessfully,
    data: userExist,
  });
};

export const updateProfile = async (req, res, next) => {
  const userExist = req.userExist;

  let image = userExist.image || {};
  if (req.file) {
    let uploadResult;
    if (!userExist.image || !userExist.image.folder) {
      const generateOtp = customAlphabet("0123456789ABCDEF", 6);
      const folderName = generateOtp();
      const folder = `sarahah-app/users/${folderName}/profilePic`;

      uploadResult = await cloudinary.uploader.upload(req.file.path, { folder });
      image = {
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        folder,
      };
    } else {
      const folder = userExist.image.folder;
      uploadResult = await cloudinary.uploader.upload(req.file.path, { folder });
      image = {
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        folder,
      };
    }

    // لحذف الصورة عند الخطأ
    req.cloudinaryImageId = image.public_id;

    userExist.image = image;
  }

  if (req.body.password) {
    userExist.password = hash({ plainText: req.body.password });
  }
  if (req.body.userName) {
    userExist.userName = req.body.userName;
  }
  if (req.body.phone) {
    userExist.phone = encrypt({ plainText: req.body.phone });
  }
  if (req.body.dob) {
    userExist.dob = req.body.dob;
  }
  if (req.body.gender) {
    userExist.gender = req.body.gender;
  }

  await userExist.save();

  userExist.password = "";
  if (userExist.phone) {
    userExist.phone = decrypt({ cipherText: userExist.phone });
  }

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: userExist,
  });
};

export const deleteProfile = async (req, res, next) => {
  const user = req.userExist;

  // 🧹 حذف صورة المستخدم من Cloudinary
  if (user.image?.public_id) {
        // حذف كل الصور داخل المجلد
        await cloudinary.api.delete_resources_by_prefix(folderPath);

        // حذف المجلد نفسه (إن لم يعد يحتوي على ملفات)
        await cloudinary.api.delete_folder(folderPath);
  }

  // 🧹 حذف الرسائل التي أرسلها أو استقبلها
  await Message.deleteMany({
    $or: [{ sender: user._id }, { receiver: user._id }],
  });

  // 🧹 حذف الحساب
  await User.findByIdAndDelete(user._id);

  return res.status(200).json({
    success: true,
    message: messages.USER.deletedSuccessfully,
  });
};

export const freezeProfile = async (req, res, next) => {
  req.userExist.isDeleted = true;
  req.userExist.deletedAt = new Date();

  await req.userExist.save();
  return res.status(200).json({
    success: true,
    message: messages.USER.archiveAccount,
  });
};

export const addFriend = async (req, res, next) => {
  const friendEmail = req.params.email;
  if (!friendEmail) return next(new Error("email is required!")); //todo in validation layer
  const friendIndex = req.userExist.friends.indexOf(friendEmail);

  if (friendIndex !== -1) {
    // إذا كان موجودًا، قم بإزالته
    req.userExist.friends.splice(friendIndex, 1);
    await req.userExist.save();
    return res.status(200).json({
      success: true,
      message: "Friend removed successfully",
      data: req.userExist.friends, // قائمة الأصدقاء المحدثة
    });
  }
  const blockIndex = req.userExist.blockUser.indexOf(friendEmail);
  if (blockIndex !== -1) {
    // إذا كان موجودًا، قم بإزالته
    req.userExist.blockUser.splice(blockIndex, 1);
  }
  req.userExist.friends.push(friendEmail);
  await req.userExist.save();
  return res.status(201).json({
    success: true,
    message: "Friend added successfully",
    data: req.userExist.friends,
  });
};

export const addBlockUser = async (req, res, next) => {
  const blockEmail = req.params.email;
  if (!blockEmail) return next(new Error("email is required!"));
  const blockIndex = req.userExist.blockUser.indexOf(blockEmail);

  if (blockIndex !== -1) {
    // إذا كان موجودًا، قم بإزالته
    req.userExist.blockUser.splice(blockIndex, 1);
    await req.userExist.save();
    return res.status(200).json({
      success: true,
      message: "block removed successfully",
      data: req.userExist.blockUser, // قائمة الأصدقاء المحدثة
    });
  }
  const friendIndex = req.userExist.friends.indexOf(blockEmail);
  if (friendIndex !== -1) {
    // إذا كان موجودًا، قم بإزالته
    req.userExist.friends.splice(friendIndex, 1);
  }
  req.userExist.blockUser.push(blockEmail);
  await req.userExist.save();
  return res.status(201).json({
    success: true,
    message: "block added successfully",
    data: req.userExist.blockUser,
  });
};

export const blockUser = async (req, res, next) => {
  const blokData = await User.find({
    email: { $in: req.userExist.blockUser },
  }).select("userName email image");

  return res.status(200).json({
    success: true,
    message: "Friends retrieved successfully",
    data: blokData,
  });
};

export const friends = async (req, res, next) => {
  const friends = await User.find({
    email: { $in: req.userExist.friends },
  }).select("userName email image");
  return res.status(200).json({
    success: true,
    message: "Friends retrieved successfully",
    data: friends,
  });
};


