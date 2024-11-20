const { Model, DataTypes } = require('sequelize');


class AssetStatus extends Model {
  static associate(models) {
    AssetStatus.hasMany(models.Asset, { foreignKey: 'assetStatusId', as: 'assets' });
    AssetStatus.hasMany(models.AssetTransaction, { foreignKey: 'assetStatusId', as: 'assetTransactions' });
  }
}

module.exports = (sequelize) => {
  AssetStatus.init(
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
      tableName: 'asset_statuses', 
      timestamps: true, 
    }
  );

  return AssetStatus;
};
