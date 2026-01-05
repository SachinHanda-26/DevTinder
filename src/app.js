const express = require("express");
// const {adminAuth, userAuth} = require("./middleware/adminAuth");
const connectDB = require("./config/database");
const User = require("./models/user.js");

const app = express();

app.post("/signup", async (req, res) => {
  // const userObj = {
  //   firstName: "Sachin",
  //   lastName: "Handa",
  //   email: "sachin@gmail.com",
  //   password: "sachin123",
  // }

  // Creating a new instance of the User model
  const user = new User({
    firstName: "virat",
    lastName: "kohli",
    email: "virat@gmail.com",
    password: "virat123",
  });

  try {
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error signing up user");
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully...");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777....");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:");
  });
