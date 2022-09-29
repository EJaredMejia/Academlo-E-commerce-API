//models
const { Product } = require("../models/products.model");
const { Category } = require("../models/category.model");

//utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");
const { ProductImg } = require("../models/productImg.model");
const { uploadProductImgs } = require("../utils/firebase.util");

const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, categoryId, quantity } = req.body;
  const { sessionUser } = req;

  const category = await Category.findOne({ where: { id: categoryId } });

  if (!category) {
    return next(new AppError("category not found", 404));
  }

  const newProduct = await Product.create({
    title,
    description,
    price,
    categoryId,
    quantity,
    userId: sessionUser.id,
  });

  await uploadProductImgs(req.files, newProduct.id);

  const productImgs = await ProductImg.findAll({
    where: { productId: newProduct.id, status: "active" },
  });

  res.status(201).json({
    status: "success",
    data: {
      newProduct,
      productImgs,
    },
  });
});

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newCategory = await Category.create({ name });

  res.status(201).json({
    status: "success",
    data: {
      newCategory,
    },
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({
    where: { status: "active" },
  });

  res.status(200).json({
    status: "success",
    categories,
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: "active" },
    include: { model: ProductImg },
  });

  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});

const getOneProduct = (req, res) => {
  const { product } = req;

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
};

const updateProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, quantity } = req.body;
  const { product } = req;

  const updatedProduct = await product.update({
    title,
    description,
    price,
    quantity,
  });

  res.status(200).json({
    status: "success",
    data: {
      updatedProduct,
    },
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: "disabled" });

  res.status(204).json({ status: "success" });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  const { name } = req.body;

  const updatedCategory = await category.update({ name });

  res.status(200).json({
    status: "success",
    data: {
      updatedCategory,
    },
  });
});

module.exports = {
  createProduct,
  createCategory,
  getAllCategories,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  updateCategory
};
