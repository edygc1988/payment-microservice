class RolPagoRepository {
    constructor({ RolPagoModel, EmpleadoModel, JefeModel }) {
      this.RolPagoModel = RolPagoModel;
      this.EmpleadoModel = EmpleadoModel;
      this.JefeModel = JefeModel;
    }
  
    async createPayrol(rolPagoData) {
      return await this.RolPagoModel.create(rolPagoData);
    }

    async getPayRol(rolPagoData){
      const pagos = await this.RolPagoModel.findAll({where: {empleadoId: rolPagoData.empleadoId, anio: rolPagoData.anio, mes: rolPagoData.mes}},{
        include: [
          {
            model: this.EmpleadoModel,
            as: 'empleado',
            include: [
              {
                model: this.JefeModel,
                as: 'superiores',
              },
            ],
          },
        ],
      });
      return pagos;
    }
  }
  
  module.exports = RolPagoRepository;
  