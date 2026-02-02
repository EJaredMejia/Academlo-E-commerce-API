import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { getDb } from "../../../utils/database.util";

export interface CategoryAttributes extends Model<
  InferAttributes<CategoryAttributes>,
  InferCreationAttributes<CategoryAttributes>
> {
  id: CreationOptional<number>;
  name: string;
  status: string;
}

export const Category = getDb().define<CategoryAttributes>("category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "active",
    allowNull: false,
  },
});
