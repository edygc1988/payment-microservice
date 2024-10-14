class JefeRepository {
    constructor( {JefeModel, EmpleadoJefeModel, EmpleadoModel }) {
      this.JefeModel = JefeModel;
      this.EmpleadoJefeModel = EmpleadoJefeModel;
      this.EmpleadoModel = EmpleadoModel;
    }
  
    async save(jefe) {
      return await this.JefeModel.upsert(jefe);
    }

    async assignJefe(empleadoId, jefeId, tipoContrato, sueldo) {
      try {
        // Asigna el jefe al empleado en la tabla intermedia
        const empleado = await this.EmpleadoModel.findByPk(empleadoId);
        const jefe = await this.JefeModel.findByPk(jefeId);

        // Asignar jefe al empleado
        await empleado.addSuperiores(jefe, { through: { tipoContrato, sueldo } });
  
        return { message: "Jefe asignado correctamente" };
      } catch (error) {
        throw new Error(error.message);
      }
    }

    
    // Método para obtener empleados de un jefe
    async getEmpleadosByJefe(jefeId) {
        try {
            const jefe = await this.JefeModel.findByPk(jefeId, {
                include: { model: this.EmpleadoModel, as: 'empleados' },
              });
            return jefe.empleados;
        } catch (error) {
          throw new Error(error.message);
        }
      }
  
    async deleteByEmpleadoId(empleadoId) {
      return await this.EmpleadoJefeModel.destroy({ where: { empleadoId } });
    }
  }
  
  module.exports = JefeRepository;
  