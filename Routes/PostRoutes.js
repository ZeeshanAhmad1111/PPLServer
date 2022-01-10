const express = require("express");
const router = express();
const userPostDetails = require("../Schema/PostSchema");
const userSignUpDetails = require("../Schema/SignUpSchema");
const fs = require("fs");
const auth = require("../Api/Auth.js");

router.post("/upload",auth,async (req, res) => {
  console.log(req.body);
  const image = req.files.image;
  fs.readFile(image.path, (err, data) => {
    const path = "./uploadImages/" + image.name;
    fs.writeFile(path, data, (err) => {
      console.log("Error in uploading the image:", err);
    });
  });
  const { title, date, time, category } = req.body;
  const data = new userPostDetails({
    title,
    date,
    time,
    likes: [],
    dislikes: [],
    comment: [],
    userId: req.body.decoded.user_id,
    userName: await userSignUpDetails.findOne({"_id":req.body.decoded.user_id}).then((res)=> { return res.userName}),
    category,
    image: "uploadImages/" + image.name,
  });
  data
    .save()
    .then(() => {
      console.log("Successfully post data is stored");
      res.send("Post Successfully");
    })
    .catch((err) => {
      console.log("Unsuccessfull post data is not stored");
      res.send("Post Unsuccessfull");
    });
});

router.route("/posts").get((req, res) => {
  userPostDetails
    .find()
    .then((posts) => {
      res.json(posts);
      console.log("find the post in db", posts);
    })
    .catch((err) => {
      console.log("Posts not found in db", err);
    });
});

module.exports = router;
