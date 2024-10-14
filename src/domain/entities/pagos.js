const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pago = sequelize.define('Pago', {
    empleadoId: { type: DataTypes.INTEGER, allowNull: false },
    sueldo: { type: DataTypes.FLOAT, allowNull: false },
    horaExtra: { type: DataTypes.FLOAT, allowNull: true },
    totalPago: { type: DataTypes.FLOAT, allowNull: false },
    fechaPago: { type: DataTypes.DATE, allowNull: false }
  }, {
    timestamps: true
  });

  return Pago;
};
