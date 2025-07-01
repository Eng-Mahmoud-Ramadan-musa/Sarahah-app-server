import path from "path";
import { OAuth2Client } from "google-auth-library";
import { customAlphabet } from "nanoid";
import {
  compareHash,
  decrypt,
  emailEmitter,
  encrypt,
  generateToken,
  hash,
  messages,
  sendEmail,
  phoneEmitter,
  subject,
  verifyToken,
} from "../../utils/index.js";
import { OTP, User, providers } from "../../db/models/index.js";
import { signupTemplate } from "../../utils/email/signupTemplate.js";

const generateUserToken = (user) => {
  const accessToken = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: "1h" },
  });

  const refreshToken = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: "7d" },
  });

  let decryptedPhone = null;
  try {
    decryptedPhone = user.phone ? decrypt({ cipherText: user.phone }) : null;
  } catch (error) {
    console.error("❌ Error decrypting phone:", error.message);
  }

  const plainUser = typeof user.toObject === 'function' ? user.toObject() : user;
  const { password, phone, ...safeUser } = plainUser;


  return {
    accessToken,
    refreshToken,
    safeUser: { ...safeUser, phone: decryptedPhone },
  };
};


// register
export const register = async (req, res, next) => {
  // get data from req
  const { email, userName, password, phone, dob } = req.body;

  // get image
  const imagePath = req.file ? path.basename(req.file.path) : null;
  // hashing phone & password
  const hashPassword = hash({ plainText: password });
  const hashPhone = encrypt({ plainText: phone });

  // create shared link
  const query = new URLSearchParams({ userName, email }).toString();
  const shareLink = `${process.env.BASE_URL}/send-message?${query}`;


  // create user
  const userCreated = await User.create({
    email,
    userName,
    password: hashPassword,
    phone: hashPhone,
    dob,
    isConfirmed: true,
    image: imagePath,
    shareLink
  });

      // send email
     const isSend = await sendEmail({
          to: email,
          subject: subject,
          html: signupTemplate("active account")})
      if (!isSend) return next(new Error(emailNotSend, {cause: 400}))

  return res
    .status(201)
    .json({ success: true, message: messages.USER.createdSuccessfully });
};

// googleLogin
const client = new OAuth2Client();
const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    console.error("Error verifying Google Token:", error);
    throw new Error("Invalid Google Token");
  }
};

export const googleLogin = async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res
      .status(400)
      .json({ success: false, message: "idToken is required" });
  }
  const { name, email, picture } = await verifyGoogleToken(idToken);
  // create shared link
  const query = new URLSearchParams({ userName: name, email }).toString();
  const shareLink = `${process.env.BASE_URL}/send-message?${query}`;
  

  let userExist = await User.findOne({ email });
  if (!userExist) {
    userExist = await User.create({
      email,
      userName: name,
      image: picture,
      provider: providers.GOOGLE,
      shareLink
    });
  }
  const { accessToken, refreshToken, safeUser } = generateUserToken(userExist);
  userExist.isDeleted = false;
  await userExist.save();
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: safeUser,
    },
  });
};


// login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist)
    return next(
      new Error(messages.USER.invalidEmailOrPassword, { cause: 404 })
    );
  if (userExist.isConfirmed == false)
    return next(new Error(messages.USER.mustActiveAccount, { cause: 400 }));
  const match = compareHash({ plainText: password, hash: userExist.password });
  if (!match)
    return next(
      new Error(messages.USER.invalidEmailOrPassword, { cause: 404 })
    );
  if (userExist.isDeleted == true) {
    await User.updateOne({ _id: userExist._id }, { isDeleted: false });
  }

  const { accessToken, refreshToken, safeUser } = generateUserToken(userExist);
  
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: safeUser,
    },
  });
};

// refreshToken
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  const result = verifyToken({payload: refreshToken});
  if (result.error) return next(result.error)

  const access_token = generateToken({payload: {email: result.email, id: result.id}, options: {expiresIn: '1h'}})
  return res.status(200).json({
    success: true,
    access_token,
  });
};

// verificationCode
export const verificationCode = async (req, res, next) => {
  const { email, subject } = req.body;
  const userExist = await User.findOne({
    email,
    isConfirmed: true,
    isDeleted: false,
  });
  if (!userExist)
    return next(
      new Error("invalid email", { cause: 404 })
    );

  const alphabet = "0123456789ABCDEF";
  const otp = customAlphabet(alphabet, 6)();
  emailEmitter.emit(
    "sendEmail",
    userExist.email,
    subject,
    userExist.userName,
    otp
  );
  userExist.filedAttempts = 5;
  await userExist.save()
  await OTP.create({ email, otp });


  return res.status(200).json({
    success: true,
    message: messages.OTP.otpSendSuccessfully,
  });
};

// // enable-2fa
export const enable2fa = async (req, res, next) => {
  const userExist = req.userExist;

  const user = await User.findOne({ email: userExist.email });
  if (!user ) return next(new Error(messages.USER.notFound, { cause: 404 }));
  userExist.twoFactorEnabled = true;
  await userExist.save();
  return res
    .status(200)
    .json({ success: true, message: "Two-step verification is enabled" });
};

// login with step 2fa
export const sendCodeStep2fa = async (req, res, next) => {
  const { content } = req.body;

  const prepareUserData = (user) => {
    user.phone = decrypt({ cipherText: user.phone });
    user.password = "";
    return user;
  };

  const generateOtp = customAlphabet("0123456789ABCDEF", 6);
  const otp = generateOtp();

  const regex = /^(002|\+2|)01[0-2,5][\d]{8}$/;
  const encryptedPhone = encrypt({ plainText: content });

  let user;
  if (regex.test(content)) {
    user = await User.findOne({ phone: encryptedPhone });
    
    if (!user) return next(new Error(messages.USER.notFound, { cause: 404 }));
    phoneEmitter.emit("sendPhone",`+2${content}`, otp, user.userName);
    await OTP.create({ phone: encryptedPhone, otp });
    
  } else {
    user = await User.findOne({ email: content });

    if (!user) return next(new Error(messages.USER.notFound, { cause: 404 }));
    
    emailEmitter.emit("sendEmail", user.email, "Verify Code", user.userName, otp);
    await OTP.create({ email: content, otp });
  }

  return res.status(200).json({ success: true, data: prepareUserData(user) });
};


export const loginWithStep2fa = async (req, res, next) => {
  const { content, code } = req.body;
  const regex = /^(002|\+2|)01[0-2,5][\d]{8}$/;
  const encryptedPhone = encrypt({ plainText: content });
  
  let user;

  if (regex.test(content)) {
    // إذا كان الرقم المدخل هو رقم هاتف
    user = await User.aggregate([
      { $match: { phone: encryptedPhone, twoFactorEnabled: true } },
      { $lookup: { from: 'otps', localField: 'email', foreignField: 'email', as: 'otpDetails' } },
      { $unwind: '$otpDetails' },
      { $match: { $expr: { $eq: ['$otpDetails.otp', code] } } },
      { $project: { email: 1, userName: 1, 'otpDetails.otp': 1, 'otpDetails._id': -1 } }
    ]).exec();

    if (!user || user.length === 0) {
      return next(new Error('Invalid phone number or OTP', { cause: 401 }));
    }
    
    const { accessToken, refreshToken, user: safeUser } = generateUserToken(user);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: { access_token: accessToken, refresh_token: refreshToken, user: safeUser },
    });
    
  } else {
    // إذا كان المدخل هو البريد الإلكتروني
    user = await OTP.aggregate([
      { $match: { email: content } },
      { $lookup: { from: 'users', localField: 'email', foreignField: 'email', as: 'userDetails' } },
      { $project: { email: 1, otp: 1, 'userDetails.userName': 1, _id: -1 } }
    ]).exec();

    if (!user || user.length === 0) {
      return next(new Error('Invalid email or OTP', { cause: 401 }));
    }

    const { accessToken, refreshToken, user: safeUser } = generateUserToken(user);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: { access_token: accessToken, refresh_token: refreshToken, user: safeUser },
    });
  }
};

// updatePassword
export const updatePassword = async (req, res, next) => {
  const { email, otp, password } = req.body;
  const userExist = await User.findOne({
    email,
    isConfirmed: true,
    isDeleted: false,
  });

  if (!userExist)
    return next(new Error(messages.USER.notFound, { cause: 404 }));

  // التأكد من عدم انتهاء مهلة الحظر
  if (userExist.expiresAt > new Date()) {
    return next(
      new Error(
        `Try again after ${
          Math.ceil((userExist.expiresAt.getTime() - new Date().getTime()) / 1000)
        } minutes`,
        { cause: 400 }
      )
    );
  }
  // التحقق من عدد المحاولات الفاشلة
  if (userExist.filedAttempts === 0) {
    userExist.expiresAt = new Date(Date.now() +  10 * 1000); // مدة الحظر: 10 دقائق
    userExist.filedAttempts = 5;
    await userExist.save();
    return next(new Error("Try again after 10 secondes", { cause: 400 }));
  }

  // التحقق من صحة الـ OTP
  const otpExist = await OTP.findOne({ email, otp });
  if (!otpExist) {
    userExist.filedAttempts -= 1; // تقليل عدد المحاولات
    await userExist.save();
    return next(
      new Error(`Verification failure. You have ${userExist.filedAttempts} attempts left.`, {
        cause: 403,
      })
    );
  }

  // تحديث كلمة المرور
  userExist.password = hash({ plainText: password });
  userExist.filedAttempts = 3; // إعادة تعيين المحاولات
  userExist.expiresAt = null; // إلغاء الحظر
  await userExist.save();

  return res.status(200).json({
    success: true,
    message: messages.USER.tryToLogin,
  });
};



