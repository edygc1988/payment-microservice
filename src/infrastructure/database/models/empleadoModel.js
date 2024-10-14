const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmpleadoModel = sequelize.define(
    'Empleado',
    {
      identificacion: { type: DataTypes.STRING, allowNull: false },
      nombre: { type: DataTypes.STRING, allowNull: false },
      correo: { type: DataTypes.STRING, allowNull: false, unique: true }
    },
    {
      tableName: 'Empleado',
      timestamps: true,
      paranoid: true,
    }
  );

  EmpleadoModel.associate = (models) => {
    // Relación con Jefe
    EmpleadoModel.belongsToMany(models.Jefe, {
      through: models.EmpleadoJefe, // Tabla intermedia
      foreignKey: 'empleadoId',
      otherKey: 'jefeId',
      as: 'superiores', // Relación con los jefes
    });

    // Relación con Pagos
    EmpleadoModel.hasMany(models.Pagos, {
      foreignKey: 'empleadoId',
      as: 'pagos', // Relación con los pagos
    });
  };

  return EmpleadoModel;
};
