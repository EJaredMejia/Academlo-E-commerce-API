import type { Request, Response, NextFunction } from "express";

// Models
import { Order } from "../models/order.model";

// Utils
import { AppError } from "../../../utils/app-error.util";
import { catchAsync } from "../../../utils/catch-async.util";

export const orderExist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findOne({ where: { id } });

    if (!order) {
      return next(new AppError("order doesnt exist", 404));
    }

    req.order = order;
    next();
  },
);
