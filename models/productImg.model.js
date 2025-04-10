const { getDb, DataTypes } = require("../utils/database.util");

const ProductImg = getDb().define("productImg", {
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

module.exports = { ProductImg };
