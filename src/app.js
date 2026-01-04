const express = require("express");

const app = express();

// app.use("/route", rH1, [rH2, rH3], rH4, rH5);

app.use(
  "/user",
 [(req, res, next) => {
    console.log("Handling Router 1st");
    // res.send("1st Response");
    next();
  },
  (req, res, next) => {
    console.log("Handling Router 2nd");
    // res.send("2nd Response");
    next();
  },
  (req, res, next) => {
    console.log("Handling Router 3rd");
    // res.send("3rd Response");
    next();
  },
  (req, res, next) => {
    console.log("Handling Router 4th");
    // res.send("4th Response");
    next();
  },
  (req, res, next) => {
    console.log("Handling Router 5th");
    res.send("5th Response");
  }
]
);

app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});
