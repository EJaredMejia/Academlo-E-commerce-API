const express = require("express");

//controllers
const {
  createProduct,
  createCategory,
  getAllCategories,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  updateCategory,
} = require("../controllers/products.controller");

//middlewares
//products middlewares
const {
  productExist,
  categoriesExist,
} = require("../middlewares/products.middlewares");

//authorization
const {
  protectSession,
  protectUsersProducts,
} = require("../middlewares/auth.middlewares");

//validators
const {
  createProductValidators,
  createCategoryValidators,
  updateProductValidators,
} = require("../middlewares/validators.middlewares");

//utils
const { upload } = require("../utils/multer.util");

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);

productsRouter.get("/categories", getAllCategories);

productsRouter.get("/:id", productExist, getOneProduct);

productsRouter.use(protectSession);

productsRouter.post(
  "/",
  upload.array("productImg", 5),
  createProductValidators,
  createProduct
);

productsRouter.post("/categories", createCategoryValidators, createCategory);

productsRouter.patch(
  "/:id",
  productExist,
  updateProductValidators,
  protectUsersProducts,
  updateProduct
);

productsRouter.patch(
  "/categories/:id",
  createCategoryValidators,
  categoriesExist,
  updateCategory
);

productsRouter.delete(
  "/:id",
  productExist,
  protectUsersProducts,
  deleteProduct
);

module.exports = { productsRouter };
