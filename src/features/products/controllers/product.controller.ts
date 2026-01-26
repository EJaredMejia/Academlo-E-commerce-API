import type { Request, Response, NextFunction } from "express";

// Models
import { Product } from "../models/product.model";
import { Category } from "../models/category.model";
import { ProductImg } from "../models/product-img.model";

// Services
import { uploadProductImgs } from "../services/firebase.service";

// Utils
import { catchAsync } from "../../../utils/catch-async.util";
import { AppError } from "../../../utils/app-error.util";

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
      status: "active",
    });

    if (req.files) {
      await uploadProductImgs(req.files as any[], (newProduct as any).id);
    }

    const productImgs = await ProductImg.findAll({
      where: { productId: (newProduct as any).id, status: "active" },
    });

    res.status(201).json({
      status: "success",
      data: {
        newProduct,
        productImgs,
      },
    });
  },
);

export const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const newCategory = await Category.create({ name, status: "active" });

    res.status(201).json({
      status: "success",
      data: {
        newCategory,
      },
    });
  },
);

export const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.findAll({
      where: { status: "active" },
    });

    res.status(200).json({
      status: "success",
      categories,
    });
  },
);

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.findAll({
      where: { status: "active" },
      include: [{ model: ProductImg }],
    });

    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  },
);

export const getOneProduct = (req: Request, res: Response) => {
  const { product } = req;

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
};

export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
);

export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { product } = req;

    await product.update({ status: "disabled" });

    res.status(204).json({ status: "success" });
  },
);

export const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category } = req;
    const { name } = req.body;

    const updatedCategory = await category.update({ name });

    res.status(200).json({
      status: "success",
      data: {
        updatedCategory,
      },
    });
  },
);
