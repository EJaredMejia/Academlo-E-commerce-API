import express from "express";

// Controllers
import {
  addProductToCart,
  updateCartProduct,
  deleteCartProduct,
  purchaseCart,
  getUsersCart,
} from "../controllers/cart.controller";

// Middlewares
import { protectSession } from "../../../middlewares/auth.middleware";
import {
  productIdExist,
  quantityMax,
  cartExist,
} from "../middlewares/cart.middleware";
import { productExist } from "../../products/middlewares/product.middleware";

// Validators
import {
  addProductToCartValidators,
  updateProductInCartValidators,
} from "../middlewares/cart-validator.middleware";

const cartsRouter: express.Router = express.Router();

cartsRouter.use(protectSession);

cartsRouter.get("/", getUsersCart);

cartsRouter.post(
  "/add-product",
  addProductToCartValidators,
  productIdExist,
  quantityMax,
  addProductToCart,
);

cartsRouter.patch(
  "/update-cart",
  updateProductInCartValidators,
  productIdExist,
  quantityMax,
  cartExist,
  updateCartProduct,
);

cartsRouter.delete("/:id", productExist, cartExist, deleteCartProduct);

cartsRouter.post("/purchase", cartExist, purchaseCart);

export { cartsRouter };
