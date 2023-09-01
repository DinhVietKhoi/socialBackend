import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const UserSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            require: true,
            min: 2,
            max: 30,
            trim: true,
        },
        fullnameFake: {
            type: String,
            require: true,
            min: 2,
            max: 30,
            trim: true,
        },
        username: {
            type: String,
            require: true,
            min:6,
            max: 15,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            min: 6,
            max: 15,
        },
        about: {
            type: String,
            trim: true,
            default: ''
        }
        ,
        avatar: {
            type: String,
            public_id: String,
            default: ''
        },
        coverPicture: {
            type: String,
            public_id: String,
            default: ''
        },
        listImage: [
            {
                type: {
                    type: String,
                    enum: ['avatar', 'coverPicture', 'post'],
                    required: true
                },
                url: {
                    type: String,
                    required: true
                },
                public_id: {
                    type: String,
                    required: true
                }
            }
        ],
        following: [
            {
                followBy: {
                    type: ObjectId,
                    ref: "users"
                },
            }
        ], 
        followers: [
            {
                followBy: {
                    type: ObjectId,
                    ref: "users"
                },
            }
        ],
        friends: [
            {
                type: ObjectId,
                ref: 'users'
            }
        ],
        friendRequests: [
            {
                from: {
                    type: ObjectId,
                    ref: 'users'
                },
                status: {
                    type: String,
                    enum: ['pending', 'accepted', 'rejected'],
                    default: 'pending'
                }
            }
        ]
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("users", UserSchema);

export default User;
