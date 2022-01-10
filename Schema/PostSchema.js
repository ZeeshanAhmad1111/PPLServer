const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: String,
    date: String,
    time: String,
    likes: Array,
    dislikes: Array,
    comment: Array,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userSignUpDetails"},
    userName: String,
    category: String,
    image: String,
})

const userPostDetails = mongoose.model("userPostDetails", PostSchema);

module.exports = userPostDetails;