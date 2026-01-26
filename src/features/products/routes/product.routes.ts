import express from "express";

// Controllers
import {
  createProduct,
  createCategory,
  getAllCategories,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  updateCategory,
} from "../controllers/product.controller";

// Middlewares
import {
  productExist,
  categoriesExist,
} from "../middlewares/product.middleware";

import {
  protectSession,
  protectUsersProducts,
} from "../../../middlewares/auth.middleware";

import {
  createProductValidators,
  createCategoryValidators,
  updateProductValidators,
} from "../middlewares/product-validator.middleware";

import { upload } from "../../../utils/multer.util";

const productsRouter: express.Router = express.Router();

productsRouter.get("/", getAllProducts);
productsRouter.get("/categories", getAllCategories);
productsRouter.get("/:id", productExist, getOneProduct);

productsRouter.use(protectSession);

productsRouter.post(
  "/",
  upload.array("productImg", 5),
  createProductValidators,
  createProduct,
);

productsRouter.post("/categories", createCategoryValidators, createCategory);

productsRouter.patch(
  "/:id",
  productExist,
  updateProductValidators,
  protectUsersProducts,
  updateProduct,
);

productsRouter.patch(
  "/categories/:id",
  createCategoryValidators,
  categoriesExist,
  updateCategory,
);

productsRouter.delete(
  "/:id",
  productExist,
  protectUsersProducts,
  deleteProduct,
);

export { productsRouter };
