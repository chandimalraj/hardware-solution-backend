const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.headers["authorization"];
  let token
  if (typeof authHeader !== "undefined") {
    // Split the Authorization header value
    const bearer = authHeader.split(" ");

    // Check if the Authorization header is in the expected format (Bearer <token>)
    if (bearer.length === 2 && bearer[0].toLowerCase() === "bearer") {
      // Set the token in the request object
     token = bearer[1];
    }
  }
  //   check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token , authorization denied" });
  }

  // Veify token
  try {
    const decoded = jwt.verify(token, config.get("jwtsecret"));

    console.log(decoded)
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
