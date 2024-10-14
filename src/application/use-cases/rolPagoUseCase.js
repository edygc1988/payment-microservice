// src/application/use-cases/RolPago.js
class RolPago {
    constructor(rolPagoRepository) {
      this.rolPagoRepository = rolPagoRepository;
    }
 
    async getPayRol(rolPagoData){
      return await this.rolPagoRepository.getPayRol(rolPagoData);
    }
}
  
  module.exports = RolPago;
  