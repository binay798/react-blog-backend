const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 150,
        required: [true,'A post must have title']
    },
    photo: {
        type: String,
        required: [true,'Must have photo of the post']
    },
    description: {
        type: String,
        required: [true,'Must have description in a post']
    },
    author: {
        type: String,
        required: [true,'Must have author']
    },
    category:{
        type: String,
        enum: ['travel','photography','fashion','food','technology'],
        default: 'travel'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    }
})

const Post = new mongoose.model('Post',postSchema)

module.exports = Post;