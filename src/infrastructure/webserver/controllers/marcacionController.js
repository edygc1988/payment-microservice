const MarcacionRepository = require('../../../domain/repositories/marcacionRepository');
const{ MarcacionModel } = require('../../database/sequelize')
const RegistrarMarcacion = require('../../../application/use-cases/registrarMarcacionUseCase');

const marcacionRepository = new  MarcacionRepository({ MarcacionModel });

exports.registrarMarcacion = async (req, res) => {
  try {
    const marcacionData = req.body;
    const registrarMarcacion = new RegistrarMarcacion(marcacionRepository);

    const marcacion = await registrarMarcacion.execute(marcacionData);

    res.status(201).json(marcacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
    