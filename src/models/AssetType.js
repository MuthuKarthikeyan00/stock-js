
const { Model, DataTypes } = require('sequelize');
class AssetType extends Model {
  static associate(models) {
    // Define associations here
    AssetType.hasMany(models.Asset, { foreignKey: 'typeId', as: 'assets' });
  }
}

module.exports = (sequelize) => {
  AssetType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      }
    },
    {
      sequelize,
      tableName: 'asset_types', 
      timestamps: true,
    }
  );

  return AssetType;
};
