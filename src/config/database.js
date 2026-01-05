const mongoose = require("mongoose");

const connectDB = async ()=>{
    mongoose.connect("mongodb+srv://namastenode:qNjlc8ZbhSLJxdws@namastenode.cwwzssp.mongodb.net/devTinder");
}

module.exports = connectDB;

