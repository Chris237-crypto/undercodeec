const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto'); // Movido al top (mejor rendimiento)
require('dotenv').config();

const app = express();

// Configuración de CORS mejorada
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://undercodeec.com' 
    : ['http://localhost:8000', 'http://localhost:8001', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware para parsear JSON con límite de tamaño
app.use(express.json({ limit: '10kb' }));

// Variables de entorno
const TOKEN = process.env.PAYPHONE_TOKEN;
const STORE_ID = process.env.PAYPHONE_STORE_ID;

// Middleware de logging solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint de pago
app.post('/api/create-payment', async (req, res) => {
  const { amount, planName } = req.body;

  // Validación de entrada
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Monto inválido' });
  }
  if (!planName || typeof planName !== 'string') {
    return res.status(400).json({ error: 'Nombre del plan requerido' });
  }

  // ID único con máximo 15 caracteres
  const clientTransactionId = crypto.randomBytes(8).toString('hex').substring(0, 15);

  try {
    const response = await axios.post(
      'https://pay.payphonetodoesposible.com/api/Links',
      {
        amount: Math.round(amount * 100), // Math.round para evitar decimales
        amountWithoutTax: Math.round(amount * 100),
        clientTransactionId,
        currency: 'USD',
        storeId: STORE_ID,
        reference: `Pago de plan: ${planName}`,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 segundos timeout
      }
    );

    if (process.env.NODE_ENV !== 'production') {
      console.log('Respuesta completa de PayPhone:', response.data);
    }

    const paymentLink = typeof response.data === 'string' ? response.data : null;

    if (!paymentLink) {
      return res.status(500).json({ error: 'No se recibió el link de pago desde PayPhone' });
    }

    res.json({ paymentUrl: paymentLink });
  } catch (error) {
    console.error('Error al crear el link:', error.response?.data || error.message);
    
    // Respuesta de error más específica
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Timeout al conectar con PayPhone' });
    }
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'Error de autenticación con PayPhone' });
    }
    
    res.status(500).json({ error: 'Error al generar link de pago' });
  }
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  } else {
    console.log(`Servidor iniciado en puerto ${PORT}`);
  }
});
