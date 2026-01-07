const express = require("express");
// const {adminAuth, userAuth} = require("./middleware/adminAuth");
const connectDB = require("./config/database");
const User = require("./models/user.js");

const app = express();

app.use(express.json());

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

app.post("/signup", async (req, res) => {
  // console.log(req.body);

  // const userObj = {
  //   firstName: "Sachin",
  //   lastName: "Handa",
  //   email: "sachin@gmail.com",
  //   password: "sachin123",
  // }

  // Creating a new instance of the User model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error signing up user:"+ err.message);
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

    const isAllowedUpdates = Object.keys(data).every((k)=>{
      ALLOWED_UPDATES.includes(k);
    })

    if(!isAllowedUpdates){
  throw new Error("Updates not allowed");
    }

    if(data?.skills.length > 10){
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
    res.status(400).send("Something went wrong:"+err.message);
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
