const validator = require("validator");

const validateSignUpData = (req)=>{
const {firstName, lastName, password, email} = req.body;

if(!firstName || !lastName){
    throw new Error("Name is not correct");
}

else if(!validator.isEmail(email)){
    throw new Error("Email is not correct");
}

else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not strong enough");

}
}

module.exports = {validateSignUpData};