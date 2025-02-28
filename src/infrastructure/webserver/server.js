const express = require('express');
const cors = require('cors');  // Importa el paquete CORS
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const {sequelize} = require('../database/sequelize');
const paymentRoutes = require('./routes/rolPagoRoutes');
const metricsRoutes = require('./routes/metricasRoutes');
const { collectDefaultMetrics } = require('prom-client');

const KafkaController = require('../../infrastructure/events/kafkaConsumer'); // Importa tu clase


// Crear instancia del controlador de Kafka
const KafkaConsumerService = new KafkaController();


const app = express();
// Configura la recolección de métricas por defecto
collectDefaultMetrics();

// Configura Helmet para seguridad de cabeceras HTTP
app.use(helmet());

// Configura limitación de tasa
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limita cada IP a 100 solicitudes por ventana de 15 minutos
});
app.use(limiter);

// Habilitar CORS para todas las solicitudes
app.use(cors());

app.use(express.json());
app.use('/api/v1/payment', paymentRoutes);
app.use('/', metricsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  await sequelize.authenticate();
  console.log('Base de datos conectada');
  await KafkaConsumerService.start();
});
