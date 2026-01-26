import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { getDb } from "../../../utils/database.util";

export interface ProductInCartAttributes extends Model<
  InferAttributes<ProductInCartAttributes>,
  InferCreationAttributes<ProductInCartAttributes>
> {
  id: CreationOptional<number>;
  cartId: number;
  productId: number;
  quantity: number;
  status: string;
}

export const ProductInCart = getDb().define<ProductInCartAttributes>(
  "productInCart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
      allowNull: false,
    },
  },
);
