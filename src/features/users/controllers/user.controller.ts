import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";

// Models
import { User } from "../models/user.model";
import { Product } from "../../products/models/product.model";
import { ProductImg } from "../../products/models/product-img.model";
import { Order } from "../../orders/models/order.model";
import { Cart } from "../../carts/models/cart.model";
import { ProductInCart } from "../../carts/models/product-in-cart.model";

// Utils
import { catchAsync } from "../../../utils/catch-async.util";
import { AppError } from "../../../utils/app-error.util";

dotenv.config({ path: "./config.env" });

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      where: { status: "active" },
    });

    res.status(200).json({
      status: "success",
      data: { users },
    });
  },
);

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    const userExist = await User.findOne({ where: { email } });

    if (userExist) {
      return next(new AppError("email is already taken", 409));
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "normal",
      status: "active",
    });

    // Remove password from response
    (newUser as any).password = undefined;

    res.status(201).json({
      status: "success",
      data: { newUser },
    });
  },
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email } = req.body;
    const { user } = req;

    await user.update({ username, email });

    res.status(200).json({
      status: "success",
      data: { user },
    });
  },
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    await user.update({ status: "disabled" });

    res.status(204).json({ status: "success" });
  },
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, status: "active" },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("Wrong credentials", 400));
    }

    (user as any).password = undefined;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });

    res.status(200).json({
      status: "success",
      data: { user, token },
    });
  },
);

export const getUsersProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sessionUser } = req;

    const products = await Product.findAll({
      where: { userId: sessionUser.id },
      include: [{ model: ProductImg }],
    });

    res.status(200).json({
      status: "success",
      data: { products },
    });
  },
);

export const getUsersOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sessionUser } = req;

    const orders = await Order.findAll({
      where: { userId: sessionUser.id },
      include: [
        {
          model: Cart,
          include: [
            {
              model: ProductInCart,
              where: { status: "purchased" },
              include: [{ model: Product, include: [{ model: ProductImg }] }],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: { orders },
    });
  },
);

export const getOneUsersOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { order } = req;

    order = await Order.findOne({
      where: { id: order.id },
      include: [
        {
          model: Cart,
          include: [
            {
              model: ProductInCart,
              where: { status: "purchased" },
              include: [{ model: Product, include: [{ model: ProductImg }] }],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: { order },
    });
  },
);
