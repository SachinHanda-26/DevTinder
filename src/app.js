const express = require("express");
const {adminAuth, userAuth} = require("./middleware/adminAuth");

const app = express();

app.use("/admin", adminAuth);

app.post("/user/login", (req,res)=>{
  console.log("User Login Request Received");
  res.send("User started Login process");
})

app.get("/user/data", userAuth, (req, res)=>{
  // console.log("User Request Received");
  res.send("User Accessed Successfully");
});

app.get("/admin/getAllData", (req, res)=>{
  // console.log("1st Request Received");
  res.send("All Data Accessed");
})

app.get("/admin/deleteData", (req, res)=>{
  // console.log("2nd Request Received");
  res.send("Data Deleted Successfully");
})


app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});
