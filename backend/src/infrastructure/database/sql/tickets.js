const ticket = (sequelize, type) => {
  return sequelize.define('tickets', {

    idTicket: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    ticketCode: {
      type: type.STRING,
      unique: true,
      allowNull: false
    },

    microserviceTicketId: {
      type: type.STRING
    },

    ticketType: {
      type: type.STRING,
      allowNull: false
    },

    priceTicket: {
      type: type.DECIMAL(10, 2),
      allowNull: false
    },

    statusTicket: {
      type: type.ENUM('vigente', 'usado', 'cancelado'),
      defaultValue: 'vigente'
    },

    purchaseDate: {
      type: type.DATE,
      defaultValue: type.NOW
    },

    qrCode: {
      type: type.TEXT
    },

    createTicket: {
      type: type.DATE,
      defaultValue: type.NOW
    },

    updateTicket: {
      type: type.DATE,
      allowNull: true
    },

    // 🔑 FOREIGN KEYS (NUNCA CIFRAR)
    eventId: {
      type: type.INTEGER,
      allowNull: false
    },

    usuarioId: {
      type: type.INTEGER,
      allowNull: false
    }

  }, {
    timestamps: false,
    comment: 'Tabla Maestra de Tickets'
  })
}

module.exports = ticket;
