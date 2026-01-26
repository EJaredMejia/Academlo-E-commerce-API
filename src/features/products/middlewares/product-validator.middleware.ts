import { body } from "express-validator";
import { checkValidations } from "../../../middlewares/validator.middleware";

export const createProductValidators = [
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

export const updateProductValidators = [
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

export const createCategoryValidators = [
  body("name")
    .notEmpty()
    .withMessage("name must not be empty")
    .isString()
    .withMessage("name must be a string"),
  checkValidations,
];
