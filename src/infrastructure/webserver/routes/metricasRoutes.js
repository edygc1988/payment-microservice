const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricasController');

router.get('/metrics', metricsController.getMetrics);

module.exports = router;