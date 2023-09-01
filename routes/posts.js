import express from "express";
import {
    addComment,
    createPost,
    getPosts,
    getPostById,
    likePost
} from '../controllers/posts.js'
import formidable from "express-formidable";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get('/', verifyToken, getPosts)
router.get('/:userId/', verifyToken, getPostById)
/* CREATE */
router.post('/create', verifyToken, createPost)
router.post('/addComment/:idPost', verifyToken, addComment)
// router.post('/create', createPost)
/* UPDATE */
router.put('/like/:idPost', verifyToken, likePost)

export default router;