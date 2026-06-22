const jwt = require("jsonwebtoken");

// Strict middleware – rejects unauthenticated requests
const protect = (req, res, next) => {
  try {
    let token = req.cookies?.token;
    const authHeader = req.headers.authorization;
    if (!token && authHeader) {
      const [type, value] = authHeader.split(" ");
      if (type === "Bearer" && value) token = value;
    }
    if (!token) return res.status(401).json({ message: "No token provided" });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

// Optional middleware – sets req.user if token present, never blocks the request
const optionalAuth = (req, res, next) => {
  try {
    let token = req.cookies?.token;
    const authHeader = req.headers.authorization;
    if (!token && authHeader) {
      const [type, value] = authHeader.split(" ");
      if (type === "Bearer" && value) token = value;
    }
    if (token) {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    }
  } catch (_) {
    // Invalid token is silently ignored on public routes
  }
  next();
};

module.exports = protect;
module.exports.protect = protect;
module.exports.optionalAuth = optionalAuth;