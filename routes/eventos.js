const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/EventoController');

router.get('/', EventoController.listarEventos);

module.exports = router;
