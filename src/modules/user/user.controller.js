import {Router} from 'express';
import * as userService from './user.service.js'
import { isAuthenticate, isValid } from '../../middleware/index.js';
import { asyncHandler, cloudUpload, fileValidation} from '../../utils/index.js';
import { updated } from './user.validation.js';

const router = Router();

router.get('/profile',isAuthenticate, asyncHandler(userService.getProfile));
router.delete('/freeze',isAuthenticate, asyncHandler(userService.freezeProfile));
router.put('/',
    isAuthenticate,
    cloudUpload(fileValidation.images).single("image"),
    isValid(updated), 
    asyncHandler(userService.updateProfile));

router.delete('/',isAuthenticate, asyncHandler(userService.deleteProfile));

router.get('/friends',isAuthenticate, asyncHandler(userService.friends));
router.get('/blockUser',isAuthenticate, asyncHandler(userService.blockUser));
router.patch('/add-friend/:email',isAuthenticate, asyncHandler(userService.addFriend));
router.patch('/add-block/:email',isAuthenticate, asyncHandler(userService.addBlockUser));
export default router;