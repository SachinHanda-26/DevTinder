const express = require('express');

const app = express();

// app.use("/hello/123", (req, res)=>{
//   res.send("Hello from hello 123 route");
// })

// app.use("/hello", (req, res)=>{
//     res.send("Hello from hello route");
// })


// app.use("/user", (req, res)=>{
//   res.send("HAHAHAHAHA");
// })

app.get("/user", (req, res)=>{
  res.send({firstname: "Sachin", secondname: "Handa"});
})

app.post("/user", (req, res)=>{
  res.send("Data saved successfully to DataBase.");
})

app.delete("/user", (req, res)=>{
  res.send("Data Deleted Successfully from DataBase");
})
// this will match all HTTP methods API call to /test route
app.use("/test", (req, res)=>{
    res.send("Hello from test route");
})


// app.use("/",(req, res)=>{
// res.send("Hello from dashboard");
// })


app.listen(7777, ()=>{
    console.log("Server is listening on port 7777");
})