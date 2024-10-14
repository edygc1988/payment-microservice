// src/application/use-cases/RegistrarMarcacion.js
class RegistrarEmpleado {
    constructor(empleadoRepository, jefeRepository) {
      this.empleadoRepository = empleadoRepository;
      this.jefeRepository = jefeRepository;
    }  

    async execute(data) {

      // Aquí podrías almacenar temporalmente las marcaciones para calcular el rol al final del mes
      console.log('Procesando marcación:', data);

      const empleadoData = data.empleado;
      const empleado = {
        id: empleadoData.id,
        identificacion: empleadoData.identificacion,
        nombre: empleadoData.nombre,
        correo: empleadoData.correo
      };
      
      // Registrar al empleado
      await this.empleadoRepository.save(empleado);

      // Eliminar relaciones previas
      await this.jefeRepository.deleteByEmpleadoId(empleado.id);

      // Extraer y mapear los superiores de empresas y personas
      let superiores = empleadoData.empresas.map(s => ({
        id: s.id,
        nombre: s.nombre,
        tipoJefe: s.tipo,
        tipoContrato: s.tipoContrato,
        sueldo: s.sueldo,
      }));
  
      superiores = [
        ...superiores,
        ...empleadoData.personas.map(s => ({
          id: s.id,
          nombre: s.nombre,
          tipoJefe: s.tipo,
          tipoContrato: s.tipoContrato,
          sueldo: s.sueldo,
        }))
      ];
  
      // Registrar los superiores
      for (const superior of superiores) {
        await this.jefeRepository.save(superior);
        await this.jefeRepository.assignJefe(empleado.id, superior.id, superior.tipoContrato, superior.sueldo);
      }
    }

    async getEmpleadoByUserId(userId) {
      return await this.empleadoRepository.getEmpleadoByUserId(userId);
    }

    // Método para obtener empleados de un jefe
    async getEmpleadosByJefe(jefeId) {
      return await this.jefeRepository.getEmpleadosByJefe(jefeId);
    }
}

module.exports = RegistrarEmpleado;