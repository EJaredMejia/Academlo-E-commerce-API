import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { getDb } from "../../../utils/database.util";

export interface UserAttributes extends Model<
  InferAttributes<UserAttributes>,
  InferCreationAttributes<UserAttributes>
> {
  id: CreationOptional<number>;
  username: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export const User = getDb().define<UserAttributes>("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "normal",
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active",
  },
});
