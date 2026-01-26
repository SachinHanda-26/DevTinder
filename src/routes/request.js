const express = require("express");

const requestRouter = express.Router();

const {userAuth} = require("../middleware/adminAuth.js");

requestRouter.post("/sendConnectionRequest", userAuth, (req,res)=>{

  const user = req.user;

  res.send(user.firstName +" Sends the connection request");
});


module.exports = requestRouter;