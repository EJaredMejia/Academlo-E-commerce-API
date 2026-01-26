import type { Request, Response, NextFunction } from "express";

// Models
import { User } from "../models/user.model";

// Utils
import { catchAsync } from "../../../utils/catch-async.util";
import { AppError } from "../../../utils/app-error.util";

export const userExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { id },
    });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;
    next();
  },
);
