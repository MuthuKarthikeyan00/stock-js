const { Model, DataTypes } = require('sequelize');

class EmployeeBranch extends Model {
  static associate(models) {

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
      },
    },
    {
      sequelize,
      tableName: 'employee_branches',
      timestamps: true,
    }
  );

  return EmployeeBranch;
};
