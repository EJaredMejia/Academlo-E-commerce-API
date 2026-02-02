import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { getDb } from "../../../utils/database.util";

export interface ProductImgAttributes extends Model<
  InferAttributes<ProductImgAttributes>,
  InferCreationAttributes<ProductImgAttributes>
> {
  id: CreationOptional<number>;
  imgUrl: string;
  productId: number;
  status: string;
}

export const ProductImg = getDb().define<ProductImgAttributes>("productImg", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "active",
    allowNull: false,
  },
});
