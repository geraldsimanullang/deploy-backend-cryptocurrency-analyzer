module.exports = {
  handleError: (error, req, res, next) => {
    let status = 500;
    let message = "Internal server error";

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      status = 400;
      message = error.errors[0].message;
    }

    if (error.message === "EmptyPassword") {
      status = 400;
      message = "Password is required";
    }

    if (error.message === "InvalidLogin") {
      status = 400;
      message = "Invalid login";
    }

    if (error.message === "LoginError") {
      status = 401;
      message = "Invalid email or password";
    }

    if (error.message === "LoginError") {
      status = 401;
      message = "Invalid email or password";
    }

    if (error.message === "Unauthenticated") {
      status = 401;
      message = "Please log in first";
    }

    if (error.name === "JsonWebTokenError") {
      status = 401;
      message = "Please log in again";
    }

    if (error.message === "PortfolioExist") {
      status = 403;
      message = "Already added this coin to your portfolio";
    }

    if (error.message === "CoinNotFound") {
      status = 404;
      message = "Coin not found";
    }

    res.status(status).json({
      message,
    });
  },
};
