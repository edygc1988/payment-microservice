const Sequelize = require('sequelize');
const { Op } = require('sequelize'); // Asegúrate de importar Op de Sequelize

// src/domain/repositories/MarcacionRepository.js
class MarcacionRepository {
    constructor({ MarcacionModel }) {
      this.MarcacionModel = MarcacionModel;
    }  
    
    async save(marcacionData) {
      const Marcacion = await this.MarcacionModel.upsert(marcacionData);
      return Marcacion;
    }

/*
    async create(marcacionData) {
      return await this.MarcacionModel.create(marcacionData);
    }

    async update(marcacionData) {
      return await this.MarcacionModel.update(marcacionData,{
        where: {
          userId: marcacionData.userId,
          anio: marcacionData.anio,
          mes: marcacionData.mes,
          dia: marcacionData.dia
        }
      });
    }*/

    async getMarcacionByDate(marcacionData) {
      return await this.MarcacionModel.findAll({
        where: {
          usuarioId: marcacionData.usuarioId,
          anio: marcacionData.anio,
          mes: marcacionData.mes,
          dia: marcacionData.dia
        }
      });

    }

    async getAllByEmpresaId(empleadoId, empresaId, year, month) {
      const marcacionData = await this.MarcacionModel.findAll({
        where: {
          empleadoId: empleadoId,
          anio: year,
          mes: month,
          empresaId: empresaId
        }
      });
      return marcacionData;
    }

    async getAllByPersonaId(empleadoId, personaId, year, month) {
      const marcacionData = await this.MarcacionModel.findAll({
        where: {
          empleadoId: empleadoId,
          anio: year,
          mes: month,
          personaId: personaId
        }
      });
      return marcacionData;
    }
  }
module.exports = MarcacionRepository;
      