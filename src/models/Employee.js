const { Model, DataTypes } = require('sequelize');
const { EmployeeRole } = require('./EmployeeRole');
const { EmployeeBranch } = require('./EmployeeBranch');
const { AssetTransaction } = require('./AssetTransaction');

class Employee extends Model {
  static associate(models) {
    // Define associations here
    Employee.belongsTo(models.EmployeeRole, { foreignKey: 'roleId', as: 'employeeRole' });
    Employee.belongsTo(models.EmployeeBranch, { foreignKey: 'branchId', as: 'employeeBranch' });
    Employee.hasMany(models.AssetTransaction, { foreignKey: 'employeeId', as: 'assetTransactions' });
  }
}

module.exports = (sequelize) => {
  Employee.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      branchId: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      }
    },
    {
      sequelize,
      tableName: 'employees', 
      timestamps: true, 
    }
  );

  return Employee;
};
