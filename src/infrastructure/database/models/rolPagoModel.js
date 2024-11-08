const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RolPagoModel = sequelize.define(
    'Pagos',
    {
      empleadoId: { type: DataTypes.INTEGER, allowNull: false },
      sueldo: { type: DataTypes.FLOAT, allowNull: false },
      horasTrabajadas: { type: DataTypes.FLOAT, allowNull: false },
      horasExtras50: { type: DataTypes.FLOAT, allowNull: false },
      horasExtras100: { type: DataTypes.FLOAT, allowNull: false },
      pagoHorasRegulares: { type: DataTypes.FLOAT, allowNull: false },
      pagoHorasExtras50: { type: DataTypes.FLOAT, allowNull: false },
      pagoHorasExtras100: { type: DataTypes.FLOAT, allowNull: false },
      iess: { type: DataTypes.FLOAT, allowNull: false },
      fondoReserva: { type: DataTypes.FLOAT, allowNull: false },
      decimoTercero: { type: DataTypes.FLOAT, allowNull: false },
      decimoCuarto: { type: DataTypes.FLOAT, allowNull: false },
      pagoTotal: { type: DataTypes.FLOAT, allowNull: false },
      fechaPago: { type: DataTypes.DATE, allowNull: false },
      anio: { type: DataTypes.INTEGER, allowNull: false },
      mes: { type: DataTypes.INTEGER, allowNull: false },
      empresaId: { type: DataTypes.INTEGER, allowNull: true },
      personaId: { type: DataTypes.INTEGER, allowNull: true },
      createdBy: { type: DataTypes.STRING },
      updatedBy: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'Pagos',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['empleadoId', 'empresaId', 'personaId', 'anio', 'mes'],
        },
      ],
    }
  );

  RolPagoModel.associate = (models) => {
    // Relación con Empleado
    RolPagoModel.belongsTo(models.Empleado, {
      foreignKey: 'empleadoId',
      as: 'empleado', // Relación con el empleado
    });
  };

  return RolPagoModel;
};
