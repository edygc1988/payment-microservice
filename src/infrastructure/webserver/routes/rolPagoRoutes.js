const express = require('express');
const paymentController = require('../controllers/rolPagoController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/calculateHours', authMiddleware, paymentController.calculate);
router.post('/calculate', authMiddleware, paymentController.calculateMes);
router.get('/:empleadoId/:anio/:mes', authMiddleware, paymentController.obteberRol);

module.exports = router;
