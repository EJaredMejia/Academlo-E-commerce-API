//models
const { Cart } = require("../models/cart.model");
const { Order } = require("../models/order.model");
const { ProductImg } = require("../models/productImg.model");
const { ProductInCart } = require("../models/productInCart.model");
const { Product } = require("../models/products.model");

//utils
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const getUsersCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
    include: {
      model: ProductInCart,
      where: { status: "active" },
      include: { model: Product, include: { model: ProductImg } },
    },
  });

  if (!cart) {
    return next(new AppError("cart not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

const addProductToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { sessionUser } = req;

  let cart = await Cart.findOne({
    where: { status: "active", userId: sessionUser.id },
  });

  //if cart doesnt exist create one
  let newCart;
  if (!cart) {
    newCart = await Cart.create({ userId: sessionUser.id });
  }

  cart = cart || newCart;

  const productInCart = await ProductInCart.findOne({
    where: { cartId: cart.id || newCart.id, status: "active", productId },
  });

  //send error, product already exist in cart
  if (productInCart) {
    return next(new AppError("product already exist in the cart", 409));
  }

  const productInCartRemoved = await ProductInCart.findOne({
    where: { cartId: cart.id || newCart.id, status: "removed", productId },
  });

  //product was removed just change the status to active
  if (productInCartRemoved) {
    const newProductInCart = await productInCartRemoved.update({
      status: "active",
      quantity,
    });

    return res.status(201).json({
      status: "success",
      data: {
        newProductInCart,
      },
    });
  }

  const newProductInCart = await ProductInCart.create({
    cartId: cart.id || newCart.id,
    productId,
    quantity,
  });

  res.status(201).json({
    status: "success",
    data: {
      newProductInCart,
    },
  });
});

const updateCartProduct = catchAsync(async (req, res, next) => {
  const { productId, newQty } = req.body;
  const { cart } = req;

  //if newQty === 0 remove product
  if (newQty === 0) {
    const updatedProduct = await ProductInCart.findOne({
      where: { cartId: cart.id, productId, status: "active" },
    });

    await updatedProduct.update({ quantity: newQty, status: "removed" });

    return res.status(204).json({ status: "success" });
  }

  //change quantity to the newQty
  const updatedProduct = await ProductInCart.findOne({
    where: { cartId: cart.id, productId, status: "active" },
  });

  if (!updatedProduct) {
    return next(new AppError("product in cart not found", 404));
  }

  await updatedProduct.update({ quantity: newQty, status: "active" });

  res.status(200).json({
    status: "success",
    data: {
      updatedProduct,
    },
  });
});

const deleteCartProduct = catchAsync(async (req, res, next) => {
  const { cart, product } = req;

  const deleteProduct = await ProductInCart.findOne({
    where: { cartId: cart.id, productId: product.id, status: "active" },
  });

  if (!deleteProduct) {
    return next(new AppError("product in cart not found", 404));
  }

  await deleteProduct.update({ quantity: 0, status: "removed" });

  res.status(204).json({ status: "success" });
});

const purchaseCart = catchAsync(async (req, res, next) => {
  const { cart, sessionUser } = req;

  const cartProducts = await ProductInCart.findAll({
    where: { cartId: cart.id, status: "active" },
  });

  if (!cartProducts) {
    return next(new AppError("there is no products in the cart", 404));
  }

  //purchase order
  let totalPrice;
  const productPromises = cartProducts.map(async (productInCart) => {
    const product = await Product.findOne({
      where: { id: productInCart.productId, status: "active" },
    });

    totalPrice = Number(product.price) * Number(productInCart.quantity);

    await product.update({
      quantity: Number(product.quantity) - Number(productInCart.quantity),
    });

    await productInCart.update({ status: "purchased" });
  });

  await Promise.all(productPromises);

  //change cart status to purchased
  await cart.update({ status: "purchased" });

  const newOrder = await Order.create({
    userId: sessionUser.id,
    cartId: cart.id,
    totalPrice,
  });

  res.status(201).json({
    status: "success",
    data: {
      newOrder,
    },
  });
});

module.exports = {
  addProductToCart,
  updateCartProduct,
  deleteCartProduct,
  purchaseCart,
  getUsersCart,
};
