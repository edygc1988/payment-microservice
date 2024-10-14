// src/infrastructure/database/models/MarcacionModel.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MarcacionModel = sequelize.define(
    "Marcacion",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      usuarioId: { type: DataTypes.INTEGER, allowNull: false },
      empleadoId: { type: DataTypes.INTEGER, allowNull: false },
      anio: { type: DataTypes.INTEGER, allowNull: false },
      mes: { type: DataTypes.INTEGER, allowNull: false },
      dia: { type: DataTypes.INTEGER, allowNull: false },
      horaInicio: { type: DataTypes.STRING },
      horaInicio1: { type: DataTypes.STRING },
      horaFin: { type: DataTypes.STRING },
      horaFin1: { type: DataTypes.STRING },
      localizacion: { type: DataTypes.STRING },
      empresaId: { type: DataTypes.INTEGER },
      personaId: { type: DataTypes.INTEGER },
      createdBy: { type: DataTypes.STRING },
      updatedBy: { type: DataTypes.STRING },
      // Campos de auditoría
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "Marcacion",
      timestamps: true, // Añade automáticamente createdAt y updatedAt
      paranoid: true, // Añade automáticamente deletedAt para soft delete
      indexes: [
        {
          unique: true, // Hacer que el índice sea único
          fields: ['usuarioId', 'anio', 'mes', 'dia', 'empresaId', 'personaId'], // Campos que forman la clave única
        }
      ],
    }
  );

  return MarcacionModel;
};
