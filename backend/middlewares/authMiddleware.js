const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Fallback to Authorization header if cookies are not set (e.g. for postman or mobile apps)
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};
