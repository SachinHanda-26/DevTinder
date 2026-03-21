const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {

  // ✅ ALLOW PREFLIGHT REQUEST
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Token missing, please login" });
    }

    const decodedData = jwt.verify(token, "Dev@Tinder$202");

    const user = await User.findById(decodedData._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();

  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: err.message });
  }
};

module.exports = {
  userAuth,
};