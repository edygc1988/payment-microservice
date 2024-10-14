// Importa los modelos
const {
  RolPagoModel,
  EmpleadoModel,
  MarcacionModel,
  JefeModel,
  EmpleadoJefeModel,
} = require("../../database/sequelize");

// Importa los repositorios
const RolPagoRepository = require("../../../domain/repositories/rolPagoRepository");
const EmpleadoRepository = require("../../../domain/repositories/empleadoRepository");
const JefeRepository = require("../../../domain/repositories/jefeRepository");
const MarcacionRepository = require("../../../domain/repositories/marcacionRepository");

// Importa los casos de uso
const RegistrarMarcacion = require("../../../application/use-cases/registrarMarcacionUseCase");
const CalculatePayrol = require("../../../application/use-cases/calcularRolPago");
const RegistrarEmpleado = require("../../../application/use-cases/registrarEmpleadoUseCase");
const RolPago = require('../../../application/use-cases/rolPagoUseCase');

// Instancia los repositorios
const rolPagoRepository = new RolPagoRepository({ RolPagoModel, EmpleadoModel, JefeModel });
const empleadoRepository = new EmpleadoRepository({ EmpleadoModel });
const marcacionRepository = new MarcacionRepository({ MarcacionModel });
const jefeRepository = new JefeRepository({
  JefeModel,
  EmpleadoJefeModel,
  EmpleadoModel,
});

// Instancia los casos de uso
const rolPagoUseCase = new RolPago(rolPagoRepository);
const calculatePayrol = new CalculatePayrol(rolPagoRepository);
const registrarMarcacion = new RegistrarMarcacion(marcacionRepository);
const registrarEmpleado = new RegistrarEmpleado(
  empleadoRepository,
  jefeRepository
);

exports.calculate = async (req, res) => {
  try {
    const { empresaId, personaId, year, month } = req.body;
    const userId = req.userId;
    let sueldo = 0;
    let empleadoId = 0;

    //Buscar marcaciones de empleados
    let empleadoData;
    if (empresaId) {
      empleadoData = await registrarEmpleado.getEmpleadosByJefe(empresaId);
      empleadoData.forEach(async (empleado) => {
        const marcacionData =
          await registrarMarcacion.getAllMarcacionsByEmpresaId(
            empleado.id,
            empresaId,
            year,
            month
          );
        empleadoId = empleado.id;
        sueldo = empleado.EmpleadoJefe.sueldo;

        const payrol = await calculatePayrol.execute(
          {
            userId,
            empleadoId,
            empresaId,
            personaId,
            sueldo,
            year,
            month
          },
          marcacionData
        );
        console.log('calculo ' + payrol);
      });
      
    }

    if (personaId) {
      empleadoData = await registrarEmpleado.getEmpleadosByJefe(personaId);
      empleadoData.forEach(async (empleado) => {
        const marcacionData =
          await registrarMarcacion.getAllMarcacionsByPersonaId(
            empleado.id,
            personaId,
            year,
            month
          );

          empleadoId = empleado.id;
          sueldo = empleado.EmpleadoJefe.sueldo;
  
          const payrol = await calculatePayrol.execute(
            {
              userId,
              empleadoId,
              empresaId,
              personaId,
              sueldo,
              year,
              month
            },
            marcacionData
          );
          console.log('calculo ' + payrol);
      });
    }

    res.status(201).json({
      message: "Pago calculated successfully",
      /*payrol*/ empleadoData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.obteberRol = async (req, res) => {
  try {
    const empleadoId = req.params.empleadoId;
    const anio = req.params.anio;
    const mes = req.params.mes;
    const rolPago = await rolPagoUseCase.getPayRol({empleadoId, anio, mes});

    res.status(200).json(rolPago);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
    