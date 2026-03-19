const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/adminAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_DATA = "firstName lastName age gender photoURL about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loginInUser = req.user;
    // getting all the pending requests received by the logged in user
    const connectionRequest = await ConnectionRequest.find({
        toUserId: loginInUser._id,
        status: "interested",
    }).populate("fromUserId", ["firstName", "lastName","age", "gender", "photoURL", "about", "skills"]);

    res.json({message: "Data fetched successfully", data: connectionRequest});
  } 
  catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res)=>{
  try{
const loginInUser = req.user;

const connectionRequests = await ConnectionRequest.find({
  $or: [
    {fromUserId: loginInUser._id, status: "accepted"},
    {toUserId: loginInUser._id, status: "accepted"}
  ],
}).populate("fromUserId", USER_DATA).populate("toUserId", USER_DATA);

console.log(connectionRequests);

const data = connectionRequests.map(row => {
  if(row.fromUserId._id.toString() === loginInUser._id.toString()){
    return row.toUserId;
  }
  return row.fromUserId;
});
res.json({data});
  }
  catch(err){
    res.status(400).send("Error: "+ err.message);
  }
})

userRouter.get("/feed", userAuth, async(req, res)=>{
  try{
    const loginInUser = req.user;

  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit >50 ? 50 : limit;

  const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {fromUserId: loginInUser._id},
        {toUserId: loginInUser._id}
      ],
    }).select("fromUserId toUserId");


    const hideUsersFromFeed = new Set();
    connectionRequests.forEach(req =>{
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {_id: {$nin: Array.from(hideUsersFromFeed)}},
        {_id: {$ne: loginInUser._id}}
      ],
    }).select(USER_DATA).skip(skip).limit(limit);

res.json({data: users});
  }
  catch(err){
    res.status(400).send("Error: "+ err.message);
  }
})

module.exports = userRouter;
