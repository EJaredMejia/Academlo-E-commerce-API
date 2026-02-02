import express from "express";
import type { Request, Response, Application } from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

// Routers
import { usersRouter } from "./features/users/routes/user.routes";
import { productsRouter } from "./features/products/routes/product.routes";
import { cartsRouter } from "./features/carts/routes/cart.routes";

// Middlewares
import { globalErrorHandler } from "./middlewares/error.middleware";

// Init our Express app
const app: Application = express();

// Enable Express app to receive JSON data
app.use(express.json());

// Enable CORS
app.use(cors());

app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
else if (process.env.NODE_ENV === "production") app.use(morgan("combined"));

// Define endpoints
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartsRouter);

// Global error handler
app.use(globalErrorHandler);

// Catch non-existing endpoints
app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `${req.method} ${req.url} does not exists in our server`,
  });
});

export { app };
