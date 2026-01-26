const express = require('express');
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validations.js");
const User = require("../models/user.js");


authRouter.post("/signup", async (req, res) => {
  // console.log(req.body);

  try {
    // validate the data
    validateSignUpData(req);

    const { password, firstName, lastName, email, skills } = req.body;

    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      email,
      skills,
      password: hashedPassword,
    });

    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error signing up user:" + err.message);
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking whether user with given email exists
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // comparing the password
    const isPasswordValid = await user.passValidate(password);

    if (isPasswordValid) {
      // create a JWT token
    const token = await user.getJWT();
      // Add the token to the cookie and send response back to the user
      res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000), httpOnly: true});
      res.send("User logged in successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error logging in user:" + err.message);
  }
});

authRouter.post("/logout", async (req,res)=>{
  res.cookie("token", null ,{
    expires: new Date(Date.now())
  });

  res.send("User logged out succesfully");
})

module.exports = authRouter;