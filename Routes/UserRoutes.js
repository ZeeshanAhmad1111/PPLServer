const express = require("express");
const router = express();
const userSignUpDetails = require("../Schema/SignUpSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../Api/Auth.js");
const nodemailer = require("nodemailer");

router.post("/signup", async (req, res) => {
  console.log("SIGN UP DATA from Frontend>>>", req.body);
  const { userName, password, email, firstName, lastName } = req.body;
  const oldUserEmail = await userSignUpDetails.findOne({
    email: email.toLowerCase(),
  });
  if (oldUserEmail) {
    console.log("Email already exist");
    return res.send("Email already exist. User Already Exist. Please Login");
  }
  const oldUserUserName = await userSignUpDetails.findOne({ userName });
  if (oldUserUserName) {
    console.log("User Name already exist");
    return res.send(
      "User Name already exist. User Already Exist. Please Login"
    );
  }
  encryptedPassword = await bcrypt.hash(password, 10);
  const data = new userSignUpDetails({
    userName,
    password: encryptedPassword,
    email: email.toLowerCase(),
    firstName,
    lastName,
  });
  data
    .save()
    .then(() => {
      console.log("Sign Up Successfully");
      res.send("Sign Up Successfully");
    })
    .catch((err) => {
      console.log("Sign Up Unsuccessfull>>>", err);
      res.send("Sign Up Unsuccessfull");
    });
});

router.post("/login", (req, res) => {
  console.log("LOG IN DATA from Frontend>>>", req.body);
  const { email, password } = req.body;
  userSignUpDetails
    .findOne({ email: email.toLowerCase() })
    .then(async (result) => {
      if (!result) {
        res.send({
          success: false,
          data: "User Not Exist",
        });
      } else {
        if (result && (await bcrypt.compare(password, result.password))) {
          const token = jwt.sign(
            { user_id: result._id, email: email.toLowerCase() },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
          //const userVerify = await jwt.verify(token, process.env.TOKEN_KEY);
          console.log("User Details>>>", result);
          res.send({
            success: true,
            data: token,
            message: "Log in successfully",
          });
        } else {
          res.send({
            success: false,
            data: "Password Incorrect",
          });
        }
      }
    })
    .catch((err) => {
      console.log("Log In Failed>>>", err);
      res.send({
        success: false,
        data: "Log In Failed",
      });
    });
});

router.post("/forgot", (req, res) => {
  console.log("FORGOT DATA from Frontend>>>", req.body);
  const { email } = req.body;
  userSignUpDetails
    .findOne({ email: email.toLowerCase() })
    .then((result) => {
      if (!result) {
        console.log("No User with this Email ID Exist");
        res.send("No User with this Email ID Exist");
      } else {
        const token = jwt.sign(
          { user_id: result._id, email: email.toLowerCase() },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        let transporter = nodemailer.createTransport({
          service: process.env.SERVICE,
          auth: {
            user: process.env.EMAILID,
            pass: process.env.PASS,
          },
        });

        let info = transporter.sendMail(
          {
            from: '"Zeeshan Ahmad" <zeeshan.ahmad@daffodilsw.com>', // sender address
            to: "ahmadzeeshan151@gmail.com", // list of receivers
            subject: "Reset Password", // Subject line
            text:
              "Click on this Link for reseting the password of your account http://127.0.0.1:3000/reset?token="+token, // body
          },
          (err, res) => {
            if (err) console.log("MAIL ERROR>>>", err);
            else console.log("MAIL RESPONSE>>>", res);
          }
        );

        console.log("User Found Successfully");
        res.send({
          success: true,
          message: "User Found successfully",
          data: token,
        });
      }
    })
    .catch((err) => {
      console.log("Forgot operation Failed>>>", err);
    });
});

router.post("/reset/:token", auth, async (req, res) => {
  console.log("RESET DATA from Frontend>>>", req.body);
  const { newPassword } = req.body;
  const { email } = req.body.decoded;
  const nPassword = await bcrypt.hash(newPassword,10);

  userSignUpDetails
    .updateOne({ email }, { $set: { password: nPassword } })
    .then((result) => {
      console.log(result);
      res.send("Password Updated Successfully");
    })
    .catch((err) => {
      console.log("Reset operation Failed");
    });
});

module.exports = router;
