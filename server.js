const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const FormData = require("express-form-data");
const path = require("path");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(FormData.parse());

const { MONGODB_URL } = process.env;
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

mongoose.connect(
    MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log("Connection with Mongodb is successfully done");
}).catch(
    (err) => {
        console.log("Error in Database Connection", err);
    }
)

app.use('/user',require("./Routes/UserRoutes"));
app.use('/post',require("./Routes/PostRoutes"));
app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
    console.log(`Express server is running at ${port}`);
})