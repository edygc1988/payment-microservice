const express = require('express');
const cors = require('cors');  // Importa el paquete CORS
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
