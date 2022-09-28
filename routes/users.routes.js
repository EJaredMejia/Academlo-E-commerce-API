const express = require("express");

// Controllers
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  getUsersProducts,
  getUsersOrders,
  getOneUsersOrder,
} = require("../controllers/users.controller");

// Middlewares
const { userExists } = require("../middlewares/users.middlewares");
const {
  protectSession,
  protectUsersAccount,
} = require("../middlewares/auth.middlewares");
const {
  createUserValidators,
  updateUserValidators,
} = require("../middlewares/validators.middlewares");
const { orderExist } = require("../middlewares/order.middlewares");

const usersRouter = express.Router();

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
  updateUser
);

usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

usersRouter.get("/orders", getUsersOrders);

usersRouter.get("/orders/:id", orderExist, getOneUsersOrder);

module.exports = { usersRouter };
