const { Kafka } = require('kafkajs');

// Importa los casos de uso
const RegistrarMarcacion = require('../../application/use-cases/registrarMarcacionUseCase');
const RegistrarEmpleado = require('../../application/use-cases/registrarEmpleadoUseCase');

// Importa los repositorios
const MarcacionRepository = require('../../domain/repositories/marcacionRepository');
const EmpleadoRepository = require('../../domain/repositories/empleadoRepository');
const JefeRepository = require('../../domain/repositories/jefeRepository');

// Importa los modelos de base de datos
const { MarcacionModel, EmpleadoModel, JefeModel, EmpleadoJefeModel } = require('../database/sequelize');

// Configuración de Kafka
const kafkaConfig = {
  clientId: 'payroll-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:29092'], // Usa la variable de entorno o un valor por defecto
};

// Instancia los repositorios
const marcacionRepository = new MarcacionRepository({ MarcacionModel });
const empleadoRepository = new EmpleadoRepository({ EmpleadoModel });
const jefeRepository = new JefeRepository({ JefeModel, EmpleadoJefeModel, EmpleadoModel });

// Instancia los casos de uso
const registerMarcacionUseCase = new RegistrarMarcacion(marcacionRepository);
const registerEmpleadoUseCase = new RegistrarEmpleado(empleadoRepository, jefeRepository);

class KafkaConsumerService {
  constructor() {
    this.kafka = new Kafka(kafkaConfig);
    this.consumer = this.kafka.consumer({ groupId: 'payroll-group' });
    this.registerMarcacionUseCase = registerMarcacionUseCase;
    this.registerEmpleadoUseCase = registerEmpleadoUseCase;
  }

  async start() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'marcacion-events', fromBeginning: true });
    await this.consumer.subscribe({ topic: 'empleado-events', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const data = JSON.parse(message.value.toString());
        if (topic === 'marcacion-events') {
          await this.processMarcacionEvent(data);
        } else if (topic === 'empleado-events') {
          await this.processEmpleadoEvent(data);
        }
      }
    });
  }

  async processMarcacionEvent(data) {
    // Delegar la lógica a los casos de uso
    await this.registerMarcacionUseCase.execute(data);
  }

  async processEmpleadoEvent(data) {
    await this.registerEmpleadoUseCase.execute(data);
  }

  async stop() {
    await this.consumer.disconnect();
  }
}

module.exports = KafkaConsumerService;
