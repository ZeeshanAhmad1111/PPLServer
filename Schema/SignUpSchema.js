const mongoose = require("mongoose");

const SignUpSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
})

const userSignUpDetails = mongoose.model("userSignUpDetails", SignUpSchema);

module.exports = userSignUpDetails;