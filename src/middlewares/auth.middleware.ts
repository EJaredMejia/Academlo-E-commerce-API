import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";

// Models
import { User } from "../features/users/models/user.model";

// Utils
import { catchAsync } from "../utils/catch-async.util";
import { AppError } from "../utils/app-error.util";

dotenv.config({ path: "./config.env" });

export const protectSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if the token was sent or not
    if (!token) {
      return next(new AppError("The token was invalid", 403));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    // Verify the token's owner
    const user = await User.findOne({
      where: { id: decoded.id, status: "active" },
    });

    if (!user) {
      return next(
        new AppError("The owner of the session is no longer active", 403),
      );
    }

    // Grant access
    req.sessionUser = user;
    next();
  },
);

export const protectUsersAccount = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { sessionUser, user } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError("You are not the owner of this account.", 403));
  }

  next();
};

export const protectAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { sessionUser } = req;

  if (sessionUser.role !== "admin") {
    return next(new AppError("You do not have the right access level.", 403));
  }

  next();
};

export const protectUsersProducts = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { product, sessionUser } = req;

  if (sessionUser.id !== product.userId) {
    return next(new AppError("You are not owner of this product", 403));
  }

  next();
};
