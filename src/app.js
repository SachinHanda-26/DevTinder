const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user.js");
const { validateSignUpData } = require("./utils/validations.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middleware/adminAuth.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const users = await User.findOne({ email: userEmail });
    if (users.length == 0) {
      res.status(404).send("No user found with the given email");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }

  // try {
  //   const users = await User.find({ email: userEmail });
  //   if (users.length == 0) {
  //     res.status(404).send("No user found with the given email");
  //   } else {
  //     res.json(users);
  //   }
  // } catch (err) {
  //   res.status(400).send("Something went wrong");
  // }
});

app.get("/profile", userAuth, async (req, res)=>{

  try{
  const user = req.user;

  if(!user){
    throw new Error("User not found");
  }

  res.send(user);
  }
catch (err) {
    res.status(400).send("Error: " + err.message);
  }
  
});

app.post("/login", async (req, res) => {
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

app.post("/signup", async (req, res) => {
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


app.post("/sendConnectionRequest", userAuth, (req,res)=>{

  const user = req.user;

  res.send(user.firstName +" Sends the connection request");
})


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
