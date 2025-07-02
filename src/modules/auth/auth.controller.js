import {Router} from 'express';
import * as authService from './auth.service.js'
import * as authValidation from './auth.validation.js';
import { isAuthenticate, isValid} from '../../middleware/index.js';
import { asyncHandler,cloudUpload, fileValidation } from '../../utils/index.js';


const router = Router();
// register
router.post('/register',
    cloudUpload(fileValidation.images).single("image"),
    isValid(authValidation.register),
    asyncHandler(authService.register));

// login
router.post('/login', 
    isValid(authValidation.login),
    asyncHandler(authService.login));

// google login
router.post('/google-login', 
    isValid(authValidation.googleLogin),
    asyncHandler(authService.googleLogin));

// refresh token
router.post('/refresh-token', 
    isValid(authValidation.refreshToken),
    asyncHandler(authService.refreshToken));

// send verification code
router.post('/verification-code', 
    isValid(authValidation.verificationCodeSchema),
    asyncHandler(authService.verificationCode));


// // enable 2fa
router.post('/enable-2fa', 
    isAuthenticate,
    // isValid(authValidation.enable2faSchema),
    asyncHandler(authService.enable2fa));


// send step 2fa
router.post('/send-code-step-2fa', 
    isValid(authValidation.sendCodeStep2faSchema),
    asyncHandler(authService.sendCodeStep2fa));

// /login with step 2fa
router.post('/login-with-step-2fa', 
    isValid(authValidation.loginWithStep2faSchema),
    asyncHandler(authService.loginWithStep2fa));

// update password
router.patch('/update-password', 
    isValid(authValidation.updatePasswordSchema),
    asyncHandler(authService.updatePassword));

  
export default router;