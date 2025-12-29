const SystemSettings = require('../../../domain/models/systemSettings');
const EventSettings = require('../../../domain/models/eventSettings');

// Obtener configuración general
const getConfiguracionGeneral = async (req, res) => {
  try {
    const config = await SystemSettings.findOne({ type: 'general' });
    if (!config) {
      return res.status(200).json({
        nombreComercial: '',
        logo: '',
        colores: {
          primario: '',
          secundario: '',
          fondo: ''
        },
        contacto: {
          email: '',
          telefono: '',
          direccion: ''
        }
      });
    }
    
    res.status(200).json({
      nombreComercial: config.nombreComercial || '',
      logo: config.logo || '',
      colores: config.colors || {
        primario: '',
        secundario: '',
        fondo: ''
      },
      contacto: config.contactInfo || {
        email: '',
        telefono: '',
        direccion: ''
      }
    });
  } catch (error) {
    console.error('Error al obtener configuración general:', error);
    res.status(500).json({ error: 'Error al obtener la configuración general' });
  }
};

// Guardar configuración general
const guardarConfiguracionGeneral = async (req, res) => {
  try {
    let config = await SystemSettings.findOne({ type: 'general' });
    
    const { nombreComercial, logo, colores, contacto } = req.body;
    
    if (config) {
      // Actualizar configuración existente
      config.nombreComercial = nombreComercial;
      config.logo = logo;
      config.colors = colores;
      config.contactInfo = contacto;
      await config.save();
    } else {
      // Crear nueva configuración
      config = new SystemSettings({
        type: 'general',
        nombreComercial,
        logo,
        colors: colores,
        contactInfo: contacto
      });
      await config.save();
    }
    
    res.status(200).json({ message: 'Configuración general guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar configuración general:', error);
    res.status(500).json({ error: 'Error al guardar la configuración general' });
  }
};

// Obtener textos legales
const getTextosLegales = async (req, res) => {
  try {
    const config = await SystemSettings.findOne({ type: 'legal' });
    if (!config) {
      return res.status(200).json({
        terminos: '',
        politica: '',
        mensajesCompra: ''
      });
    }
    
    res.status(200).json({
      terminos: config.terms || '',
      politica: config.privacy || '',
      mensajesCompra: config.purchaseMessages || ''
    });
  } catch (error) {
    console.error('Error al obtener textos legales:', error);
    res.status(500).json({ error: 'Error al obtener los textos legales' });
  }
};

// Guardar textos legales
const guardarTextosLegales = async (req, res) => {
  try {
    let config = await SystemSettings.findOne({ type: 'legal' });
    
    const { terminos, politica, mensajesCompra } = req.body;
    
    if (config) {
      // Actualizar configuración existente
      config.terms = terminos;
      config.privacy = politica;
      config.purchaseMessages = mensajesCompra;
      await config.save();
    } else {
      // Crear nueva configuración
      config = new SystemSettings({
        type: 'legal',
        terms: terminos,
        privacy: politica,
        purchaseMessages: mensajesCompra
      });
      await config.save();
    }
    
    res.status(200).json({ message: 'Textos legales guardados correctamente' });
  } catch (error) {
    console.error('Error al guardar textos legales:', error);
    res.status(500).json({ error: 'Error al guardar los textos legales' });
  }
};

// Obtener configuración de negocio
const getConfiguracionNegocio = async (req, res) => {
  try {
    const config = await SystemSettings.findOne({ type: 'business' });
    if (!config) {
      return res.status(200).json({
        moneda: 'USD',
        limiteTickets: 10,
        transporteHabilitado: true,
        productosHabilitados: true
      });
    }
    
    res.status(200).json({
      moneda: config.paymentConfig?.defaultCurrency || 'USD',
      limiteTickets: config.businessConfig?.maxSeatsPerReservation || 10,
      transporteHabilitado: config.businessConfig?.enableTransport || true,
      productosHabilitados: config.businessConfig?.enableProducts || true
    });
  } catch (error) {
    console.error('Error al obtener configuración de negocio:', error);
    res.status(500).json({ error: 'Error al obtener la configuración de negocio' });
  }
};

// Guardar configuración de negocio
const guardarConfiguracionNegocio = async (req, res) => {
  try {
    let config = await SystemSettings.findOne({ type: 'business' });
    
    const { moneda, limiteTickets, transporteHabilitado, productosHabilitados } = req.body;
    
    if (config) {
      // Actualizar configuración existente
      config.paymentConfig = {
        ...config.paymentConfig,
        defaultCurrency: moneda
      };
      config.businessConfig = {
        ...config.businessConfig,
        maxSeatsPerReservation: limiteTickets,
        enableTransport: transporteHabilitado,
        enableProducts: productosHabilitados
      };
      await config.save();
    } else {
      // Crear nueva configuración
      config = new SystemSettings({
        type: 'business',
        paymentConfig: {
          defaultCurrency: moneda
        },
        businessConfig: {
          maxSeatsPerReservation: limiteTickets,
          enableTransport: transporteHabilitado,
          enableProducts: productosHabilitados
        }
      });
      await config.save();
    }
    
    res.status(200).json({ message: 'Configuración de negocio guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar configuración de negocio:', error);
    res.status(500).json({ error: 'Error al guardar la configuración de negocio' });
  }
};

// Obtener información de la empresa (para clientes)
const getInfoEmpresa = async (req, res) => {
  try {
    const [generalConfig, legalConfig] = await Promise.all([
      SystemSettings.findOne({ type: 'general' }),
      SystemSettings.findOne({ type: 'legal' })
    ]);
    
    const response = {
      nombreComercial: generalConfig?.nombreComercial || '',
      logo: generalConfig?.logo || '',
      contacto: generalConfig?.contactInfo || {
        email: '',
        telefono: '',
        direccion: ''
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener información de la empresa:', error);
    res.status(500).json({ error: 'Error al obtener la información de la empresa' });
  }
};

// Obtener términos y condiciones (para clientes)
const getTerminosCondiciones = async (req, res) => {
  try {
    const config = await SystemSettings.findOne({ type: 'legal' });
    if (!config) {
      return res.status(200).json({
        texto: 'No hay términos y condiciones disponibles actualmente.'
      });
    }
    
    res.status(200).json({
      texto: config.terms || 'No hay términos y condiciones disponibles actualmente.'
    });
  } catch (error) {
    console.error('Error al obtener términos y condiciones:', error);
    res.status(500).json({ error: 'Error al obtener los términos y condiciones' });
  }
};

// Obtener política de privacidad (para clientes)
const getPoliticaPrivacidad = async (req, res) => {
  try {
    const config = await SystemSettings.findOne({ type: 'legal' });
    if (!config) {
      return res.status(200).json({
        texto: 'No hay política de privacidad disponible actualmente.'
      });
    }
    
    res.status(200).json({
      texto: config.privacy || 'No hay política de privacidad disponible actualmente.'
    });
  } catch (error) {
    console.error('Error al obtener política de privacidad:', error);
    res.status(500).json({ error: 'Error al obtener la política de privacidad' });
  }
};

// Obtener ayuda/FAQ (para clientes)
const getAyudaFAQ = async (req, res) => {
  try {
    // Por ahora, devolver una respuesta estándar
    // En el futuro, esto podría venir de una base de datos
    res.status(200).json({
      faqs: [
        {
          pregunta: '¿Cómo compro entradas?',
          respuesta: 'Puedes navegar por nuestros eventos disponibles, seleccionar el evento que te interesa, elegir la cantidad de entradas y completar el proceso de pago.'
        },
        {
          pregunta: '¿Puedo devolver mis entradas?',
          respuesta: 'Las políticas de devolución dependen de cada evento. Por favor revisa los términos específicos del evento antes de realizar tu compra.'
        },
        {
          pregunta: '¿Cómo puedo contactar al soporte?',
          respuesta: 'Puedes contactarnos a través de nuestro formulario de contacto o enviar un correo electrónico a soporte@ejemplo.com.'
        }
      ]
    });
  } catch (error) {
    console.error('Error al obtener ayuda/FAQ:', error);
    res.status(500).json({ error: 'Error al obtener la ayuda y preguntas frecuentes' });
  }
};

module.exports = {
  getConfiguracionGeneral,
  guardarConfiguracionGeneral,
  getTextosLegales,
  guardarTextosLegales,
  getConfiguracionNegocio,
  guardarConfiguracionNegocio,
  getInfoEmpresa,
  getTerminosCondiciones,
  getPoliticaPrivacidad,
  getAyudaFAQ
};