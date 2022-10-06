const express = require("express");

//controllers
const {
  addProductToCart,
  updateCartProduct,
  deleteCartProduct,
  purchaseCart,
  getUsersCart,
} = require("../controllers/carts.controller");

//middlewares
//authorization
const { protectSession } = require("../middlewares/auth.middlewares");

//carts middlewares
const {
  productIdExist,
  quantityMax,
  cartExist,
} = require("../middlewares/carts.middlewares");

//product middlewares
const { productExist } = require("../middlewares/products.middlewares");

//validators
const {
  addProductToCartValidators,
  updateProductInCartValidators,
} = require("../middlewares/validators.middlewares");

const cartsRouter = express.Router();

cartsRouter.use(protectSession);

cartsRouter.get("/", getUsersCart);

cartsRouter.post(
  "/add-product",
  addProductToCartValidators,
  productIdExist,
  quantityMax,
  addProductToCart
);

cartsRouter.patch(
  "/update-cart",
  updateProductInCartValidators,
  productIdExist,
  quantityMax,
  cartExist,
  updateCartProduct
);

cartsRouter.delete("/:id", productExist, cartExist, deleteCartProduct);

cartsRouter.post("/purchase", cartExist, purchaseCart);

module.exports = { cartsRouter };
