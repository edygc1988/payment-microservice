// src/application/use-cases/RegistrarMarcacion.js
class RegistrarMarcacion {
    constructor(marcacionRepository) {
      this.marcacionRepository = marcacionRepository;
    }

    async execute(marcacionData){
      
        // Aquí podrías almacenar temporalmente las marcaciones para calcular el rol al final del mes
        console.log('Procesando marcación:', marcacionData);

        // Lógica para almacenar o procesar la marcación
        const marcacion = await this.getMarcacionByDate(marcacionData);
        if (!marcacionData.horaInicio)
          marcacionData.horaInicio = marcacion.horaInicio;
        if (!marcacionData.horaInicio1)
          marcacionData.horaInicio1 = marcacion.horaInicio1;
        if (!marcacionData.horaFin)
          marcacionData.horaFin = marcacion.horaFin;
        if (!marcacionData.horaFin1)
          marcacionData.horaFin1 = marcacion.horaFin1;

        return await this.marcacionRepository.save(marcacionData);
    }
  

    async getMarcacionByDate(date) {
      return await this.marcacionRepository.getMarcacionByDate(date);
    }

    async getAllMarcacionsByEmpresaId(empleadoId, empresaId, year, month) {
      return await this.marcacionRepository.getAllByEmpresaId(empleadoId, empresaId, year, month);
    }
    
    async getAllMarcacionsByPersonaId(empleadoId, personaId, year, month) {
      return await this.marcacionRepository.getAllByPersonaId(empleadoId, personaId, year, month);
    }
}
  
  module.exports = RegistrarMarcacion;
  