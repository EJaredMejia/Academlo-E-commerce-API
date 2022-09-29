//models
const { Category } = require("../models/category.model");
const { ProductImg } = require("../models/productImg.model");
const { Product } = require("../models/products.model");

//utils
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const productExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id, status: "active" },
    include: { model: ProductImg },
  });

  if (!product) {
    return next(new AppError("product not found", 404));
  }

  req.product = product;
  next();
});

const categoriesExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOne({ where: { id, status: "active" } });

  if (!category) {
    return next(new AppError("category not found", 404));
  }

  req.category = category;
  next();
});

module.exports = { productExist, categoriesExist };
