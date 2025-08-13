const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// Configurar CORS correctamente
app.use(cors({
  origin: 'http://localhost:5173', // frontend
  credentials: true
}));

app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas conectado'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Rutas
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server escuchando en puerto ${PORT}`));
