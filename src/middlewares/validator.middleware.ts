import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../utils/app-error.util";

export const checkValidations = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    const message = errorMessages.join(". ");

    return next(new AppError(message, 400));
  }

  next();
};
