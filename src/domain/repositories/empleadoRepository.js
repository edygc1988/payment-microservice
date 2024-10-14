class EmpleadoRepository {
    constructor({ EmpleadoModel }) {
      this.EmpleadoModel = EmpleadoModel;
    }
  
    async save(empleadoData) {
      const empleado = await this.EmpleadoModel.upsert(empleadoData);
      return empleado;
    }

    async getEmpleadoByUserId(userId) {
      const empleado = await this.EmpleadoModel.findAll({where:{userId: userId}});
      return empleado;
    }
    

  }
  
  module.exports = EmpleadoRepository;
  