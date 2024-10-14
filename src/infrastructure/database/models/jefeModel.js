const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const JefeModel = sequelize.define(
    'Jefe',
    {
      nombre: { type: DataTypes.STRING, allowNull: false },
      tipoJefe: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: 'Jefe',
      timestamps: false,
    }
  );

  JefeModel.associate = (models) => {
    JefeModel.belongsToMany(models.Empleado, {
      through: models.EmpleadoJefe, // Tabla intermedia
      foreignKey: 'jefeId',
      otherKey: 'empleadoId',
      as: 'empleados', // Relación con los empleados
    });
  };

  return JefeModel;
};
