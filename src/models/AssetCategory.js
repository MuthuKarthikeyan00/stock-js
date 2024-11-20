const { Model, DataTypes } = require('sequelize');

class AssetCategory extends Model {
  static associate(models) {
    AssetCategory.hasMany(models.Asset, { foreignKey: 'categoryId', as: 'assets' });
  }
}

module.exports = (sequelize) => {
  AssetCategory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      }
    },
    {
      sequelize,
      tableName: 'asset_categories',
      timestamps: true, 
    }
  );

  return AssetCategory;
};
