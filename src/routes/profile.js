const express = require("express");
const profileRouter = express.Router();

const {userAuth} = require("../middleware/adminAuth.js");

profileRouter.get("/profile", userAuth, async (req, res)=>{

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

module.exports = profileRouter;