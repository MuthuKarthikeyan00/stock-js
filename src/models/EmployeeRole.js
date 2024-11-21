const { Model, DataTypes } = require('sequelize');

class EmployeeRole extends Model {
  static associate(models) {
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
      tableName: 'employee_roles', 
      timestamps: true, 
    }
  );

  return EmployeeRole;
};
