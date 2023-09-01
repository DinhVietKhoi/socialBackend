import express from "express";
import {
    getUser,
    updateAvatar,
    updateAbout,
    unfollow,
    updateCoverPicture,
    follow,
    searchUsers
} from '../controllers/users.js'

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get('/',verifyToken,searchUsers)
router.get('/:id', verifyToken, getUser)
/* CREATE */

/* UPDATE */
// router.patch('/:id/:friendId', verifyToken, addRemoveFriend)
router.put('/follow', verifyToken, follow)
router.put('/unfollow', verifyToken, unfollow)


router.put('/updateAvatar/', verifyToken, updateAvatar)
router.put('/updateCoverPicture/', verifyToken, updateCoverPicture)
router.put('/updateAbout', verifyToken, updateAbout)

/* DELETE */
export default router;