const { Model, DataTypes } = require('sequelize');
const { Employee } = require('./Employee');

class EmployeeRole extends Model {
  static associate(models) {
    // Define the association between EmployeeRole and Employee
    EmployeeRole.hasMany(models.Employee, { foreignKey: 'roleId', as: 'employees' });
  }
}

module.exports = (sequelize) => {
  EmployeeRole.init(
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
      tableName: 'employee_roles', 
      timestamps: true, 
    }
  );

  return EmployeeRole;
};
