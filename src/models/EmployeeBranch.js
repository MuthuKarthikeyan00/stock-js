const { Model, DataTypes } = require('sequelize');
const { Employee } = require('./Employee');

class EmployeeBranch extends Model {
  static associate(models) {
    // Define the association between EmployeeBranch and Employee
    EmployeeBranch.hasMany(models.Employee, { foreignKey: 'branchId', as: 'employees' });
  }
}

module.exports = (sequelize) => {
  EmployeeBranch.init(
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
      tableName: 'employee_branches', 
      timestamps: true, 
    }
  );

  return EmployeeBranch;
};
