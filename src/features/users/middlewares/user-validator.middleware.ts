import { body } from "express-validator";
import { checkValidations } from "../../../middlewares/validator.middleware";

export const createUserValidators = [
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

export const updateUserValidators = [
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
