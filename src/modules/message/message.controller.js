import {Router} from 'express';
import * as msgS from './message.service.js'
import * as msgV from './message.validation.js'
import { isAuthenticate, isAuthorized, isValid } from '../../middleware/index.js';
import { asyncHandler } from "../../utils/index.js";


const router = Router();

router.post('/send',isAuthenticate, isValid(msgV.sendMessage), asyncHandler(msgS.sendMessage));
router.patch('/archive-or-restore/:id',isAuthenticate, asyncHandler(msgS.archiveOrRestoreMessage));
router.patch('/:id',isAuthenticate, asyncHandler(msgS.addOrRemoveToFavorite));
router.delete('/delete-all',isAuthenticate, asyncHandler(msgS.deleteAllMessage));
router.delete('/:id',isAuthenticate, asyncHandler(msgS.deleteMessage));
router.put('/archive-all',isAuthenticate, asyncHandler(msgS.archiveAllMessage));
router.put('/restore-all',isAuthenticate, asyncHandler(msgS.restoreAllMessage));
router.get('/all-sender',isAuthenticate, asyncHandler(msgS.getAllMessageSender));
router.get('/all-receiver',isAuthenticate, asyncHandler(msgS.getAllMessageReceiver));
router.get('/all-favorite',isAuthenticate, asyncHandler(msgS.getAllMessageFavorite));
router.get('/all-archive',isAuthenticate, asyncHandler(msgS.getArchiveAllMessage));
router.get('/',isAuthenticate, asyncHandler(msgS.getAllMessage));

export default router;