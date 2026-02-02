import { User } from "../features/users/models/user.model";
import { Order } from "../features/orders/models/order.model";
import { Cart } from "../features/carts/models/cart.model";
import { Product } from "../features/products/models/product.model";
import { Category } from "../features/products/models/category.model";
import { ProductInCart } from "../features/carts/models/product-in-cart.model";
import { ProductImg } from "../features/products/models/product-img.model";

export const initModels = () => {
  // 1 User <-----> M Order
  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User);

  // 1 User <-----> 1 Cart
  User.hasOne(Cart, { foreignKey: "userId" });
  Cart.belongsTo(User);

  // 1 Cart <-----> 1 Order
  Cart.hasOne(Order, { foreignKey: "cartId" });
  Order.belongsTo(Cart);

  // 1 User <-----> M Product
  User.hasMany(Product, { foreignKey: "userId" });
  Product.belongsTo(User);

  // 1 Product <----> 1 Category
  Category.hasOne(Product, { foreignKey: "categoryId" });
  Product.belongsTo(Category);

  // 1 Product <----> 1 ProductInCart
  Product.hasOne(ProductInCart, { foreignKey: "productId" });
  ProductInCart.belongsTo(Product);

  // 1 Product <----> M ProductImg
  Product.hasMany(ProductImg, { foreignKey: "productId" });
  ProductImg.belongsTo(Product);

  // 1 Cart <----> M ProductInCart
  Cart.hasMany(ProductInCart, { foreignKey: "cartId" });
  ProductInCart.belongsTo(Cart);
};
