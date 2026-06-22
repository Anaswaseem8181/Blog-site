const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    const authHeader = req.headers.authorization;

    if (!token && authHeader) {
      const [type, value] = authHeader.split(" ");

      if (type === "Bearer" && value) {
        token = value;
      }
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