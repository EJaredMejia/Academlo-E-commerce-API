import express from "express";

// Controllers
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  getUsersProducts,
  getUsersOrders,
  getOneUsersOrder,
} from "../controllers/user.controller";

// Middlewares
import { userExists } from "../middlewares/user.middleware";
import {
  protectSession,
  protectUsersAccount,
} from "../../../middlewares/auth.middleware";
import {
  createUserValidators,
  updateUserValidators,
} from "../middlewares/user-validator.middleware";
import { orderExist } from "../../orders/middlewares/order.middleware";

const usersRouter: express.Router = express.Router();

usersRouter.post("/", createUserValidators, createUser);
usersRouter.post("/login", login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.get("/me", getUsersProducts);

usersRouter.patch(
  "/:id",
  userExists,
  updateUserValidators,
  protectUsersAccount,
  updateUser,
);

usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

usersRouter.get("/orders", getUsersOrders);
usersRouter.get("/orders/:id", orderExist, getOneUsersOrder);

export { usersRouter };
