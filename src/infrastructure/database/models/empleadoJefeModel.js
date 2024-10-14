const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmpleadoJefeModel = sequelize.define(
    'EmpleadoJefe',
    {
      empleadoId: { type: DataTypes.INTEGER, allowNull: false },
      jefeId: { type: DataTypes.INTEGER, allowNull: false },
      tipoContrato: { type: DataTypes.INTEGER, allowNull: true },
      sueldo: { type: DataTypes.DOUBLE, allowNull: true },
    },
    {
      tableName: 'EmpleadoJefe',
      timestamps: false,
    }
  );
  return EmpleadoJefeModel;
};
