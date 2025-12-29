const express = require('express');
const router = express.Router();

const {
  crearTicket,
  obtenerTicketsPorUsuario,
  usarTicket,
  cancelarTicket
} = require('../controllers/tickets.controller');

// Crear compra
router.post('/crear', crearTicket);

// Historial del cliente
router.get('/usuario/:id', obtenerTicketsPorUsuario);

// Cambiar estados
router.put('/usar/:id', usarTicket);
router.put('/cancelar/:id', cancelarTicket);

module.exports = router;
