const express = require('express');

const app = express();

app.use("/test", (req, res)=>{
    res.send("Hello from test route");
})

app.use("/hello", (req, res)=>{
    res.send("Hello from hello route");
})

app.use("/",(req, res)=>{
res.send("Hello from dashboard");
})


app.listen(7777, ()=>{
    console.log("Server is listening on port 7777");
})