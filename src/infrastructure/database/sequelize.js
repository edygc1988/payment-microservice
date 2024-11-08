const { Sequelize } = require('sequelize');
const config = require('../../config/config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config);

// Cargar los modelos
const RolPagoModel = require('./models/rolPagoModel')(sequelize);
const EmpleadoModel = require('./models/empleadoModel')(sequelize);
const JefeModel = require('./models/jefeModel')(sequelize); // Cambiado a JefeModel si prefieres llamarlo así
const EmpleadoJefeModel = require('./models/empleadoJefeModel')(sequelize);
const MarcacionModel = require('./models/marcacionModel')(sequelize);

// Definir las asociaciones
EmpleadoModel.associate({ 
  Jefe: JefeModel, 
  EmpleadoJefe: EmpleadoJefeModel, 
  Pagos: RolPagoModel, // Asocia con los pagos
  Marcacion: MarcacionModel // Asocia con las marcaciones
});

JefeModel.associate({ 
  Empleado: EmpleadoModel, 
  EmpleadoJefe: EmpleadoJefeModel 
});

RolPagoModel.associate({ 
  Empleado: EmpleadoModel // Asocia el rol de pago con el empleado
});

/*MarcacionModel.associate({ 
  Empleado: EmpleadoModel // Asocia las marcaciones con el empleado
});*/

// Sincronizar la base de datos
sequelize.sync({alter: true});

module.exports = { sequelize, RolPagoModel, EmpleadoModel, JefeModel, EmpleadoJefeModel, MarcacionModel };
