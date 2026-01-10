const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user.js");
const { validateSignUpData } = require("./utils/validations.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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

app.get("/profile", async (req, res)=>{

  try{
  const cookies = req.cookies;
  
  // console.log(cookies);


  // validate the JWT token
  const {token} = cookies;
  // console.log(token);
if(!token){
  throw new Error("Invalid token");
}

  const decodedMessage = await jwt.verify(token, "Dev@Tinder$202");
  // console.log(decodedMessage);
const {_id} = decodedMessage;
  const user = await User.findById(_id);
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create a JWT token
    const token = await jwt.sign({_id: user._id}, "Dev@Tinder$202");
      // Add the token to the cookie and send response back to the user
      res.cookie("token", token);
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

// Feed API - Get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length == 0) {
      res.status(404).send("No users found in the database");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const users = await User.findByIdAndDelete(userId);
    if (users.length == 0) {
      res.status(404).send("No user found with the given ID");
    } else {
      res.send("User deleted successfully");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoURL", "about", "skills", "gender", "age"];

    const isAllowedUpdates = Object.keys(data).every((k) => {
      ALLOWED_UPDATES.includes(k);
    });

    if (!isAllowedUpdates) {
      throw new Error("Updates not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const users = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    if (users.length == 0) {
      res.status(404).send("No user found with the given ID");
      return;
    } else {
      res.send("User Updated Successfully");
      // console.log(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
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
