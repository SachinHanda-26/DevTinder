const express = require("express");
// const {adminAuth, userAuth} = require("./middleware/adminAuth");

const app = express();

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Oops! There is an error");
  }
});

app.get("/getUserData", (req, res) => {
  // try {
    throw new Error("fjkdnbbnd");
    res.send("User Data accessed");
  // } 
  // catch (err) {
  //   res.status(500).send("Something went wrong");
  // }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Oops! There is an error");
  }
});

app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});
