const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Asset extends Model {
    static associate(models) {
      Asset.belongsTo(models.AssetStatus, { foreignKey: 'assetStatusId', as: 'assetStatus' });
      Asset.belongsTo(models.AssetType, { foreignKey: 'typeId', as: 'assetType' });
      Asset.belongsTo(models.AssetCategory, { foreignKey: 'categoryId', as: 'assetCategory' });
      Asset.belongsTo(models.AssetTransactionType, { foreignKey: 'assetTransactionTypeId', as: 'assetTransactionType' });
      Asset.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employee' });
      Asset.hasMany(models.AssetTransaction, { foreignKey: 'assetId', as: 'assetTransactions' });
    }
  }

  Asset.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      serialNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assetStatusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      assetTransactionTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'assets',
      timestamps: true,
    }
  );

  return Asset;
};
