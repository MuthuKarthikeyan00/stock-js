const { Model, DataTypes } = require('sequelize');

class EmployeeBranch extends Model {
  static associate(models) {
    // Define associations
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
        unique: true,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
    },
    {
      sequelize, // Passing sequelize instance here
      tableName: 'employee_branches',
      timestamps: true,
    }
  );

  return EmployeeBranch;
};
