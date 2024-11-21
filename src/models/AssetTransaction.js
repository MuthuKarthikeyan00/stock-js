
const { Model, DataTypes } = require('sequelize');

class AssetTransaction extends Model {
  static associate(models) {
    AssetTransaction.belongsTo(models.Asset, { foreignKey: 'assetId', as: 'asset' });
    AssetTransaction.belongsTo(models.AssetStatus, { foreignKey: 'assetStatusId', as: 'assetStatus' });
    AssetTransaction.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employee' });
    AssetTransaction.belongsTo(models.AssetTransactionType, { foreignKey: 'assetTransactionTypeId', as: 'assetTransactionType' });
  }
}

module.exports = (sequelize) => {
  AssetTransaction.init(
    {
      assetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      assetStatusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assetTransactionTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    },
    {
      sequelize,
      tableName: 'asset_transactions',
      timestamps: false, 
    }
  );

  return AssetTransaction;
};
