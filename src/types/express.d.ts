import { User } from "../features/users/models/user.model";
import { Product } from "../features/products/models/product.model";
import { Cart } from "../features/carts/models/cart.model";
import { Order } from "../features/orders/models/order.model";
import { Category } from "../features/products/models/category.model";

declare global {
  namespace Express {
    interface Request {
      sessionUser?: InstanceType<typeof User> | any;
      user?: InstanceType<typeof User> | any;
      product?: InstanceType<typeof Product> | any;
      cart?: InstanceType<typeof Cart> | any;
      order?: InstanceType<typeof Order> | any;
      category?: InstanceType<typeof Category> | any;
    }
  }
}
