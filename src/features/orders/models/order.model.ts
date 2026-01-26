import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { getDb } from "../../../utils/database.util";

export interface OrderAttributes extends Model<
  InferAttributes<OrderAttributes>,
  InferCreationAttributes<OrderAttributes>
> {
  id: CreationOptional<number>;
  userId: number;
  cartId: number;
  totalPrice: number;
  status: string;
}

export const Order = getDb().define<OrderAttributes>("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active",
  },
});
