const dotenv = require("dotenv");

// Utils
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const sendErrorDev = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  });
};

const sendErrorProd = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message || "Something went wrong!",
  });
};

const tokenExpiredError = () => {
  return new AppError("Session expired", 403);
};

const tokenInvalidSignatureError = () => {
  return new AppError("Session invalid", 403);
};

const dbUniqueConstraintError = () => {
  return new AppError("The entered email has already been taken", 400);
};

const imgLimitError = () => {
  return new AppError("You can only upload 5 images max", 400);
};

const globalErrorHandler = (error, req, res, next) => {
  // Set default values for original error obj
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "fail";
  error.message = error.message;

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "TokenExpiredError") error = tokenExpiredError();
    else if (error.name === "JsonWebTokenError")
      error = tokenInvalidSignatureError();
    else if (error.name === "SequelizeUniqueConstraintError")
      error = dbUniqueConstraintError();
    else if (error.code === "LIMIT_UNEXPECTED_FILE") error = imgLimitError();
    sendErrorProd(error, req, res);
  }
};

module.exports = { globalErrorHandler };
