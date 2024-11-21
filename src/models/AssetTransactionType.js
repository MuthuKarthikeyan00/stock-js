
const { Model, DataTypes } = require('sequelize');

class AssetTransactionType extends Model {
  static associate(models) {
    AssetTransactionType.hasMany(models.Asset, { foreignKey: 'typeId', as: 'assets' });
    AssetTransactionType.hasMany(models.AssetTransaction, { foreignKey: 'assetTransactionTypeId', as: 'assetTransactions' });
  }
}

module.exports = (sequelize) => {
  AssetTransactionType.init(
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      }
    },
    {
      sequelize,
      tableName: 'asset_transaction_types', 
      timestamps: true, 
    }
  );

  return AssetTransactionType;
};
