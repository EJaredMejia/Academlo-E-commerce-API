//models
const { Cart } = require("../models/cart.model");
const { Product } = require("../models/products.model");

//utils
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const productIdExist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findOne({
    where: { id: productId, status: "active" },
  });

  if (!product) {
    return next(new AppError("product not found", 404));
  }

  req.product = product;
  next();
});

const quantityMax = (req, res, next) => {
  const { quantity, newQty } = req.body;
  const { product } = req;

  if ((quantity || newQty) > product.quantity) {
    return next(
      new AppError(
        "quantity exceeds the amount of items we have of this product",
        400
      )
    );
  }

  next();
};

const cartExist = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
  });

  //cart doesnt exist send error
  if (!cart) {
    return next(new AppError("cart not found", 404));
  }

  req.cart = cart;
  next();
});

module.exports = { productIdExist, quantityMax, cartExist };
