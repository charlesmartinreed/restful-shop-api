// JWT allows us to verify that an incoming token is valid
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // verify also decodes

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach the decoded data to the req, for use in routes
    req.userData = decoded;

    // succesfully authenticated
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed"
    });
  }
};
