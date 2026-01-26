import { body } from "express-validator";
import { checkValidations } from "../../../middlewares/validator.middleware";

export const addProductToCartValidators = [
  body("productId")
    .notEmpty()
    .withMessage("productId must not be empty")
    .isNumeric()
    .withMessage("productId must be a number"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity must not be empty")
    .isInt({ min: 1 })
    .withMessage("quantity must be a number greater than 0"),
  checkValidations,
];

export const updateProductInCartValidators = [
  body("productId")
    .notEmpty()
    .withMessage("productId must not be empty")
    .isNumeric()
    .withMessage("productId must be a number"),
  body("newQty")
    .notEmpty()
    .withMessage("newQty must not be empty")
    .isInt({ min: 0 })
    .withMessage("newQty must be a number greater or equal than 0"),
  checkValidations,
];
