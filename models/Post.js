import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: "users"
    },
    image: {
        url: String,
        public_id: String
    },
    like: [
        {
            type: ObjectId,
            ref: "users"
        }
    ],
    comment: [
        {
            text: String,
            created: {
                type: Date,
                default: Date.now
            },
            
            postedBy: {
                type: ObjectId,
                ref: "users"
            },
        }
    ]
}, {timestamps: true});
const Post = mongoose.model("posts", PostSchema)

export default Post;