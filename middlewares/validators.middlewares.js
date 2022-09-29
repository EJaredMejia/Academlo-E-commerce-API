const { body, validationResult } = require("express-validator");

// Utils
const { AppError } = require("../utils/appError.util");

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // [{ ..., msg }] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
    const errorMessages = errors.array().map((err) => err.msg);

    const message = errorMessages.join(". ");

    return next(new AppError(message, 400));
  }

  next();
};

const createUserValidators = [
  body("username")
    .isString()
    .withMessage("username must be a string")
    .notEmpty()
    .withMessage("username cannot be empty")
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters"),
  body("email").isEmail().withMessage("Must provide a valid email"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  checkValidations,
];

const updateUserValidators = [
  body("username")
    .isString()
    .withMessage("username must be a string")
    .notEmpty()
    .withMessage("username cannot be empty")
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters"),
  body("email").isEmail().withMessage("Must provide a valid email"),
  checkValidations,
];

const createProductValidators = [
  body("title")
    .notEmpty()
    .withMessage("title must not be empty")
    .isString()
    .withMessage("title must be a string"),
  body("description")
    .notEmpty()
    .withMessage("description must not be empty")
    .isString()
    .withMessage("description must be a string"),
  body("price")
    .notEmpty()
    .withMessage("price must not be empty")
    .isNumeric()
    .withMessage("price must be a number"),
  body("categoryId")
    .notEmpty()
    .withMessage("categoryId must not be empty")
    .isNumeric()
    .withMessage("categoryId must be a number"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity must not be empty")
    .isNumeric()
    .withMessage("quantity must be a number"),
  checkValidations,
];

const updateProductValidators = [
  body("title")
    .notEmpty()
    .withMessage("title must not be empty")
    .isString()
    .withMessage("title must be a string"),
  body("description")
    .notEmpty()
    .withMessage("description must not be empty")
    .isString()
    .withMessage("description must be a string"),
  body("price")
    .notEmpty()
    .withMessage("price must not be empty")
    .isNumeric()
    .withMessage("price must be a number"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity must not be empty")
    .isNumeric()
    .withMessage("quantity must be a number"),
  checkValidations,
];

const createCategoryValidators = [
  body("name")
    .notEmpty()
    .withMessage("name must not be empty")
    .isString()
    .withMessage("name must be a string"),
  checkValidations,
];

module.exports = {
  createUserValidators,
  updateUserValidators,
  createProductValidators,
  createCategoryValidators,
  updateProductValidators
};
