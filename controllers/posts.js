import Post from '../models/Post.js'
import User from '../models/User.js'
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// console.log(process.env.CLOUDINARY_CLOUD_NAME)
/* CREATE */
export const createPost = async(req, res) => {
    try {
        const { content, postedBy, image } = req.body;
        const user = await User.findById(postedBy);

        const newPost = new Post({
            postedBy,
            content,
        })
        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "images",
            })
            newPost.image.url = result.secure_url;
            newPost.image.idpublic = result.public_id
            user.listImage = [...user.listImage, { type:'post', url:result.secure_url, public_id: result.public_id}]
            user.save()
        }
        
        const newPost2 = await (await newPost.save()).populate('postedBy')
        res.status(201).json(newPost2);
    }
    catch (err) {
        res.status(409).json({message: err})
    }
}
export const addComment = async(req, res) => {
    try {
        const idPost = req.params.idPost;
        const { text, postedBy } = req.body;
        const post = await Post.findById(idPost);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại' });
        }
        post.comment = [...post.comment, {...req.body} ]
        const updatePost = await (await post.save()).populate('comment.postedBy')
        res.status(201).json(updatePost.comment);
    }
    catch (err) {
        res.status(500).json({message: err})
    }
}

/* READ */
export const getPosts = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const post = await Post.find().populate('postedBy').populate('comment.postedBy').sort({ createdAt: -1 }).skip(skip).limit(5).exec();
        res.status(200).json(post);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getPostById = async (req, res) => {
    try {
        const { userId } = req.params;
        const skip = parseInt(req.query.skip) || 0;
        const post = await Post.find({ postedBy: userId }).populate('postedBy').populate('comment.postedBy').sort({ createdAt: -1 }).skip(skip).limit(5).exec();
        res.status(200).json(post);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const idPost = req.params.idPost;
        const { idUser } = req.body;
        const post = await Post.findById(idPost)

        if (post.like.includes(idUser)) {
            post.like = post.like.filter((id) => id != idUser)
        }
        else {
            post.like.push(idUser)
        }
        
        await post.save()
        res.status(200).json(post.like)
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}