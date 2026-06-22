module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error("ERROR:", {
    message: err.message,
    stack: err.stack,
  });

  if (err.isOperational) {
    return res.status(statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};