class JefeRepository {
    constructor( {JefeModel, EmpleadoJefeModel, EmpleadoModel }) {
      this.JefeModel = JefeModel;
      this.EmpleadoJefeModel = EmpleadoJefeModel;
      this.EmpleadoModel = EmpleadoModel;
    }
  
    async save(jefe) {
      return await this.JefeModel.upsert(jefe);
    }

    async assignJefe(empleadoId, superior) {
      try {
        // Asigna el jefe al empleado en la tabla intermedia

        console.log(superior);
        const empleado = await this.EmpleadoModel.findByPk(empleadoId);
        const jefe = await this.JefeModel.findByPk(superior.id);

        // Asignar jefe al empleado
        const tipoContrato = superior.tipoContrato;
        const sueldo = superior.sueldo;
        const mensualizaDecimoTercero = superior.mensualizaDecimoTercero;
        const mensualizaDecimoCuarto = superior.mensualizaDecimoCuarto;
        const fechaInicio = superior.fechaInicio;
        const fechaFin = superior.fechaFin;
        await empleado.addSuperiores(jefe, { through: { tipoContrato, sueldo, mensualizaDecimoTercero, mensualizaDecimoCuarto, fechaInicio, fechaFin } });
  
        return { message: "Jefe asignado correctamente" };
      } catch (error) {
        throw new Error(error);
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
  