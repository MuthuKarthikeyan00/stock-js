const { Model, DataTypes } = require('sequelize');

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
      tableName: 'employee_roles', 
      timestamps: true, 
    }
  );

  return EmployeeRole;
};
