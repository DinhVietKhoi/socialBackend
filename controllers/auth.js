import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../models/User.js"
import removeDiacritics from 'remove-diacritics';

/* REGISTER USER */

export const register = async (req, res) => {
    try {
        const {
            fullname,
            username,
            password,
        } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullname,
            fullnameFake:removeDiacritics(fullname),
            username,
            password:passwordHash,
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    }
    catch (err) {
        res.status(500).json({ error: err.message})
    }
}

/* LOGGIN USER */
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
            .populate('followers.followBy')
            .populate('following.followBy')
            .exec();
        if (!user) return res.status(400).json({ msg: "User do not exist. " });
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        const userNew = Object.assign({}, user._doc);
        delete userNew.password;
        return res.status(200).json({token, userNew})
    }
    catch (err) {
        res.status(500).json({ error: err.message})
    }
}

