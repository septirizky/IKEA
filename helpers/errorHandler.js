const errorHandler = (error, req, res, next) => {
  console.log(error);
  let status = 500;
  let message = "Internal Server Error";

  if (error.name === "SequelizeValidationError") {
    status = 400;
    message = error.errors[0].message;
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    status = 400;
    message = error.errors[0].message;
  }

  if (error.name === "SequelizeDatabaseError") {
    status = 400;
    message = "Invalid input";
  }

  if (error.name === "SequelizeForeignKeyConstraintError") {
    status = 400;
    message = "Invalid input";
  }

  if (error.name === "LoginError") {
    message = "Incorrect email or password";
    status = 401;
  }

  if (error.name === "Unauthorized" || error.name == "JsonWebTokenError") {
    message = "Please login first";
    status = 401;
  }

  if (error.name === "Forbidden") {
    message = "You dont have any access";
    status = 403;
  }

  if (error.name === "NotFound") {
    status = 404;
    message = `Data not found`;
  }

  if (error.name === "NotFound") {
    status = 404;
    message = `Data with id ${error.id} not found`;
  }

  res.status(status).json({
    message,
  });
};

module.exports = errorHandler;
