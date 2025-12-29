const orm = require('../../../infrastructure/database/connection/dataBase.orm');
const { cifrarDatos, descifrarSeguro } = require('../../../application/encrypDates');

// ===============================
// CREAR TICKET
// ===============================
const crearTicket = async (req, res) => {
    try {
        const {
            ticketCode,
            ticketType,
            priceTicket,
            eventId,
            usuarioId
        } = req.body;

        if (!ticketCode || !ticketType || !priceTicket || !eventId || !usuarioId) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        await orm.Ticket.create({
            ticketCode: cifrarDatos(ticketCode),   // 🔐
            ticketType: cifrarDatos(ticketType),   // 🔐
            priceTicket: priceTicket,              // ❌ NO cifrar (DECIMAL)
            statusTicket: 'vigente',               // ❌ NO cifrar (ENUM)
            purchaseDate: new Date(),              // ❌ DATE
            eventId,                               // ❌ FK
            usuarioId,                             // ❌ FK
            createTicket: new Date()               // ❌ DATE
        });

        return res.status(201).json({
            message: 'Ticket creado correctamente'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al crear ticket',
            error: error.message
        });
    }
};

// ===============================
// OBTENER TICKETS POR USUARIO
// ===============================
const obtenerTicketsPorUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const tickets = await orm.Ticket.findAll({
            where: { usuarioId: id }
        });

        const respuesta = tickets.map(t => ({
            idTicket: t.idTicket,
            ticketCode: descifrarSeguro(t.ticketCode),
            ticketType: descifrarSeguro(t.ticketType),
            priceTicket: t.priceTicket,
            statusTicket: t.statusTicket,   // ❌ NO descifrar
            purchaseDate: t.purchaseDate,
            eventId: t.eventId
        }));

        return res.json(respuesta);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener tickets',
            error: error.message
        });
    }
};

// ===============================
// USAR TICKET
// ===============================
const usarTicket = async (req, res) => {
    try {
        const { id } = req.params;

        await orm.Ticket.update(
            {
                statusTicket: 'usado',
                updateTicket: new Date()
            },
            { where: { idTicket: id } }
        );

        return res.json({ message: 'Ticket usado correctamente' });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al usar ticket',
            error: error.message
        });
    }
};

// ===============================
// CANCELAR TICKET
// ===============================
const cancelarTicket = async (req, res) => {
    try {
        const { id } = req.params;

        await orm.Ticket.update(
            {
                statusTicket: 'cancelado',
                updateTicket: new Date()
            },
            { where: { idTicket: id } }
        );

        return res.json({ message: 'Ticket cancelado correctamente' });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al cancelar ticket',
            error: error.message
        });
    }
};

module.exports = {
    crearTicket,
    obtenerTicketsPorUsuario,
    usarTicket,
    cancelarTicket
};
