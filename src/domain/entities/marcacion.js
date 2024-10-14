// src/domain/entities/Marcacion.js
class Marcacion {
    constructor({ userId, date, type, location, empresaId, personaId, createdBy, updatedBy }) {
      this.userId = userId;
      this.date = date;
      this.type = type;
      this.empresaId = empresaId;
      this.personaId = personaId;
      this.location = location;
      this.createdBy = createdBy;
      this.updatedBy = updatedBy;
    }
  }
  
  module.exports = Marcacion;
  