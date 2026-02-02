import type { Request, Response, NextFunction } from "express";

// Models
import { Cart } from "../models/cart.model";
import { Order } from "../../orders/models/order.model";
import { ProductImg } from "../../products/models/product-img.model";
import { ProductInCart } from "../models/product-in-cart.model";
import { Product } from "../../products/models/product.model";

// Utils
import { AppError } from "../../../utils/app-error.util";
import { catchAsync } from "../../../utils/catch-async.util";

export const getUsersCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sessionUser } = req;

    const cart = await Cart.findOne({
      where: { userId: sessionUser.id, status: "active" },
      include: [
        {
          model: ProductInCart,
          where: { status: "active" },
          include: [{ model: Product, include: [{ model: ProductImg }] }],
        },
      ],
    });

    if (!cart) {
      return next(new AppError("cart not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { cart },
    });
  },
);

export const addProductToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;
    const { sessionUser } = req;

    let cart = await Cart.findOne({
      where: { status: "active", userId: sessionUser.id },
    });

    if (!cart) {
      cart = await Cart.create({ userId: sessionUser.id, status: "active" });
    }

    const productInCart = await ProductInCart.findOne({
      where: { cartId: (cart as any).id, status: "active", productId },
    });

    if (productInCart) {
      return next(new AppError("product already exist in the cart", 409));
    }

    const productInCartRemoved = await ProductInCart.findOne({
      where: { cartId: (cart as any).id, status: "removed", productId },
    });

    if (productInCartRemoved) {
      const newProductInCart = await productInCartRemoved.update({
        status: "active",
        quantity,
      });

      return res.status(201).json({
        status: "success",
        data: { newProductInCart },
      });
    }

    const newProductInCart = await ProductInCart.create({
      cartId: cart.id,
      productId,
      quantity,
      status: "active",
    });

    res.status(201).json({
      status: "success",
      data: { newProductInCart },
    });
  },
);

export const updateCartProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, newQty } = req.body;
    const { cart } = req;

    if (newQty === 0) {
      const updatedProduct = await ProductInCart.findOne({
        where: { cartId: cart.id, productId, status: "active" },
      });

      if (updatedProduct) {
        await updatedProduct.update({ quantity: newQty, status: "removed" });
      }

      return res.status(204).json({ status: "success" });
    }

    const updatedProduct = await ProductInCart.findOne({
      where: { cartId: cart.id, productId, status: "active" },
    });

    if (!updatedProduct) {
      return next(new AppError("product in cart not found", 404));
    }

    await updatedProduct.update({ quantity: newQty, status: "active" });

    res.status(200).json({
      status: "success",
      data: { updatedProduct },
    });
  },
);

export const deleteCartProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cart, product } = req;

    const deleteProduct = await ProductInCart.findOne({
      where: { cartId: cart.id, productId: product.id, status: "active" },
    });

    if (!deleteProduct) {
      return next(new AppError("product in cart not found", 404));
    }

    await deleteProduct.update({ quantity: 0, status: "removed" });

    res.status(204).json({ status: "success" });
  },
);

export const purchaseCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cart, sessionUser } = req;

    const cartProducts = await ProductInCart.findAll({
      where: { cartId: cart.id, status: "active" },
      include: [{ model: Product }],
    });

    if (!cartProducts || cartProducts.length === 0) {
      return next(new AppError("there is no products in the cart", 404));
    }

    let totalPrice = 0;
    const productPromises = cartProducts.map(async (productInCart: any) => {
      totalPrice += productInCart.product.price * productInCart.quantity;

      await productInCart.product.update({
        quantity:
          Number(productInCart.product.quantity) -
          Number(productInCart.quantity),
      });

      await productInCart.update({ status: "purchased" });
    });

    await Promise.all(productPromises);

    await cart.update({ status: "purchased" });

    const newOrder = await Order.create({
      userId: sessionUser.id,
      cartId: cart.id,
      totalPrice,
      status: "active",
    });

    res.status(201).json({
      status: "success",
      data: { newOrder },
    });
  },
);
