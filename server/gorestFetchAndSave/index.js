const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

//load env variables
const { MONGO_DATABASE_URL, GOREST_USERS_URL, PORT, GOREST_TOKEN } =
  process.env;

const axiosConfig = {
  headers: {
    Authorization: "Bearer " + GOREST_TOKEN,
  },
};

//load database
const connectDB = async () => {
  mongoose
    .connect(MONGO_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected Successfully"))
    .catch((err) => console.error("Failed to connect database. ", err.message));
};
connectDB();

//Load schema
require("./User.model");
const UsersModel = mongoose.model("User");

const app = express();
app.use(express.urlencoded({ extended: true }));

//Fetch data from API and insert into the database
app.get("/users/fetchdata", async (req, res) => {
  try {
    const getDataRef = await axios.get(GOREST_USERS_URL, axiosConfig);
    const usersList = getDataRef && getDataRef.data && getDataRef.data.data;

    //bulk insert fetched data
    const insertData = await UsersModel.insertMany(usersList);

    return res.status(201).json({
      staus: "success",
      message: "User data fetched and inserted in database",
      data: insertData,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

//404 for other routes
app.get("*", (req, res) => {
  res.status(404).json({ status: "error", message: "Page not found" });
});

app.listen(PORT, function () {
  console.log(`FETCH & INSERT - micro service running on ${PORT}`);
});
