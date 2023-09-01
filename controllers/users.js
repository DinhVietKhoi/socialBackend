import User from '../models/User.js'
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import removeDiacritics from 'remove-diacritics';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
            .populate('followers.followBy')
            .populate('following.followBy')
            .select('-password')
            .exec();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        const userNew = Object.assign({}, user._doc);
        res.status(200).json({token,userNew});
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}
/* UPDATE */

export const updateAvatar = async (req, res) => {
    const { image, id } = req.body
    try {
        const user = await User.findById(id);
        const result = await cloudinary.uploader.upload(image, {
            folder: "images",
        })
        user.avatar  = result.secure_url;
        user.listImage = [...user.listImage, { type:'avatar', url:result.secure_url, public_id: result.public_id}]
        
        user.save()
        res.status(200).json({ avatar: user.avatar });
    }
    catch (err) {
        res.status(404).json({message: err.message})
    }
    
}
export const updateCoverPicture = async (req, res) => {
    const { image, id } = req.body
    try {
        const user = await User.findById(id);
        const result = await cloudinary.uploader.upload(image, {
            folder: "images",
        })
        user.coverPicture = result.secure_url;
        
        user.listImage = [...user.listImage, { type:'coverPicture', url:result.secure_url, public_id: result.public_id}]
        user.save()

        res.status(200).json({ coverPicture: user.coverPicture });
    
    }
    catch (err) {
        res.status(404).json({message: err.message})
    }
    
}
export const updateAbout = async (req, res) => {
    const { content, id } = req.body
    try {
        const user = await User.findById(id);
        user.about = content;
        user.save()
        res.status(200).json({ about: user.about });
    
    }
    catch (err) {
        res.status(404).json({message: err.message})
    }
    
}

export const follow = async (req, res) => {
    const { idUser, id } = req.body
    try {
        
        const userMain = await User.findById(id)
        if (!userMain) {
            return res.status(404).json({message: 'User not found'})
        }

        const arrcheck1 = userMain.following.filter(f=>f.followBy!==idUser)
        if (!arrcheck1.length > 0) {
            
            userMain.following = [...userMain.following,{followBy: idUser}]
        }

        const userSecond = await User.findById(idUser)
        if (!userSecond) {
            return res.status(404).json({message: 'User not found'})
        }
        const arrcheck2 = userSecond.followers.filter(f => f.followBy !== id)
        if (!arrcheck2.length>0) {
            userSecond.followers = [...userSecond.followers,{followBy: id}]
        }
        await userMain.save();
        const userSecondNew = await (await userSecond.save()).populate('followers.followBy')
        res.status(201).json({followers: userSecondNew.followers})

    }
    catch(err) {
        res.status(500).json({message: err})
    }
}

export const unfollow = async (req, res) => {
    const { idUser, id } = req.body
    try {
        const userMain = await User.findById(id)
        if (!userMain) {
            return res.status(404).json({message: 'User not found'})
        }
        userMain.following = userMain.following.filter(f => f.followBy.toString() == id)
        const userSecond = await User.findById(idUser)
        if (!userSecond) {
            return res.status(404).json({message: 'User not found'})
        }
        userSecond.followers = userSecond.following.filter(f=>f.followBy.toString()!==idUser)
        await userMain.save()
        const userSecondNew = await (await userSecond.save()).populate('followers.followBy')
        res.status(201).json({ followers: userSecondNew.followers })
    }
    catch(err) {
        res.status(500).json({message: 'Internal server error'})
    }
}

export const searchUsers = async (req, res) => {
    const name = removeDiacritics(req.query.name);
    try {
        let users;
        if (name) {
        const regex = new RegExp(`.*${name}.*`, 'i');
            users = await User.find({ fullnameFake: regex });
        } else {
            users = await User.find();
        }
        console.log(users)
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};