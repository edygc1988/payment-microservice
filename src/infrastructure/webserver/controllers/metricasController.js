const promClient = require('prom-client');

// Definir métricas a exponer
const requestsCounter = new promClient.Counter({
  name: 'my_microservice_requests_total',
  help: 'Total de solicitudes al microservicio'
});

exports.getMetrics = async (req, res) => {
  try {
    // Incrementar contador de solicitudes
    /*requestsCounter.inc();
    res.set('Content-Type', promClient.register.contentType);
    res.send(await promClient.register.metrics());*/

    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());

  } catch (err) {
    res.status(500).send(err);
  }
};

exports.incrementRequestsCounter = () => {
  requestsCounter.inc();
};