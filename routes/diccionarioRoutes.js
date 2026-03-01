const express = require('express');
const router = express.Router();
const diccionarioController = require('../controllers/diccionarioController');

/**
 * @route   GET /api/diccionario/descargar
 * @desc    Descarga el diccionario de datos en formato Excel
 * @access  Public (puedes proteger con authMiddleware si lo necesitas)
 */
router.get('/descargar', diccionarioController.generarDiccionarioDatos);

module.exports = router;
