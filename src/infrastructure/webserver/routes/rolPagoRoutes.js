const express = require('express');
const paymentController = require('../controllers/rolPagoController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/calculate', authMiddleware, paymentController.calculate);
router.get('/:empleadoId/:anio/:mes', authMiddleware, paymentController.obteberRol);

module.exports = router;
