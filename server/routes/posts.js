import express from 'express';
import { getFeedPosts, getUserPosts, likePost, createPost } from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* READ ROUTES */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.post("/createPost", verifyToken, createPost);

/* UPDATE ROUTES */
router.patch("/:id/like", verifyToken, likePost);
//router.post("/:id/comment", verifyToken, createComment);

export default router;
