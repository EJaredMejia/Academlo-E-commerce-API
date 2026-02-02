import type { Request, Response, NextFunction } from "express";

// Models
import { Cart } from "../models/cart.model";
import { Product } from "../../products/models/product.model";

// Utils
import { AppError } from "../../../utils/app-error.util";
import { catchAsync } from "../../../utils/catch-async.util";

export const productIdExist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.body;

    const product = await Product.findOne({
      where: { id: productId, status: "active" },
    });

    if (!product) {
      return next(new AppError("product not found", 404));
    }

    req.product = product;
    next();
  },
);

export const quantityMax = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { quantity, newQty } = req.body;
  const { product } = req;

  if ((quantity || newQty) > product.quantity) {
    return next(
      new AppError(
        "quantity exceeds the amount of items we have of this product",
        400,
      ),
    );
  }

  next();
};

export const cartExist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sessionUser } = req;

    const cart = await Cart.findOne({
      where: { userId: sessionUser.id, status: "active" },
    });

    if (!cart) {
      return next(new AppError("cart not found", 404));
    }

    req.cart = cart;
    next();
  },
);
