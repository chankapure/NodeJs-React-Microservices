const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const Json2csvParser = require("json2csv").Parser;
require("dotenv").config();

//load env variables
const { MONGO_DATABASE_URL, PORT } = process.env;

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
app.use(express.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//Fetch data from NoSql
app.get("/export/users", async (req, res) => {
  try {
    const usersData = await UsersModel.find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    );

    //export to csv
    const jsonUsers = JSON.parse(JSON.stringify(usersData));
    const json2csvParser = new Json2csvParser();
    const csvData = json2csvParser.parse(jsonUsers);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users.csv");
    res.status(200).end(csvData);
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

//404 for other routes
app.get("*", (req, res) => {
  res.status(404).json({ status: "error", message: "Page not found" });
});

app.listen(PORT, function () {
  console.log(`User Export to CSV - micro service running on ${PORT}`);
});
