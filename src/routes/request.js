const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middleware/adminAuth.js");

const ConnectionRequest = require("../models/connectionRequest.js");

const User = require("../models/user.js");

requestRouter.post("/request/send/:status/:toUserId", userAuth,async(req, res) => {
  try {

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

     const allowedStatus = ["interested", "ignore"];

    if(!allowedStatus.includes(status)){
      return res.status(400).json({error: "Invalid status: " + status});
    }


    const toUser = await User.findById(toUserId);
    if(!toUser){
      return res.status(404).json({error: "User not found!"});
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId}
      ]
    })

    if(existingConnectionRequest){
      return res.status(400).json({error: "Connection request already exists!"});
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({message: req.user.firstName + " is " + status + " in " + toUser.firstName, data});
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }

  // res.send(user.firstName +" Sends the connection request");
});

module.exports = requestRouter;
