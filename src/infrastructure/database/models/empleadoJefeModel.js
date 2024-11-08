const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmpleadoJefeModel = sequelize.define(
    'EmpleadoJefe',
    {
      empleadoId: { type: DataTypes.INTEGER, allowNull: false },
      jefeId: { type: DataTypes.INTEGER, allowNull: false },
      tipoContrato: { type: DataTypes.INTEGER, allowNull: true },
      sueldo: { type: DataTypes.DOUBLE, allowNull: true },
      mensualizaDecimoTercero: { type: DataTypes.INTEGER },
      mensualizaDecimoCuarto: { type: DataTypes.INTEGER},
      fechaInicio: { type: DataTypes.DATE},
      fechaFin: { type: DataTypes.DATE},
    },
    {
      tableName: 'EmpleadoJefe',
      timestamps: false,
    }
  );
  return EmpleadoJefeModel;
};
