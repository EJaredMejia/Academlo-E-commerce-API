import type { Request, Response, NextFunction } from "express";

// Models
import { Category } from "../models/category.model";
import { ProductImg } from "../models/product-img.model";
import { Product } from "../models/product.model";

// Utils
import { AppError } from "../../../utils/app-error.util";
import { catchAsync } from "../../../utils/catch-async.util";

export const productExist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, status: "active" },
      include: [{ model: ProductImg }],
    });

    if (!product) {
      return next(new AppError("product not found", 404));
    }

    req.product = product;
    next();
  },
);

export const categoriesExist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id, status: "active" },
    });

    if (!category) {
      return next(new AppError("category not found", 404));
    }

    req.category = category;
    next();
  },
);
