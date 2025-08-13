// routes/auth.js
const express = require('express');
const User = require('../models/user');
const { generarAccessToken, generarRefreshToken } = require('../tokenService');

const router = express.Router();
let refreshTokensDB = []; // almacenamiento en memoria

// Registro (contraseña en texto plano)
router.post('/register', async (req, res) => {
  const { username, password, petName } = req.body;

  try {
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const newUser = new User({ username, password, petName });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login (sin hash)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const accessToken = generarAccessToken(username);
    const refreshToken = generarRefreshToken();

    // Refresh token expira en 1 minuto
    refreshTokensDB.push({
      username,
      refreshToken,
      expires: Date.now() + 1 * 60 * 1000
    });

    console.log(`[AUTH] Usuario ${username} inició sesión. Access y refresh generados.`);

    res.status(200).json({ accessToken, refreshToken, password }); // password solo para debug
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  const tokenInfo = refreshTokensDB.find(
    t => t.refreshToken === refreshToken && t.expires > Date.now()
  );

  if (!tokenInfo) {
    return res.status(403).json({ message: 'Refresh token inválido o expirado' });
  }

  // Eliminamos el viejo
  refreshTokensDB = refreshTokensDB.filter(t => t.refreshToken !== refreshToken);

  const newAccessToken = generarAccessToken(tokenInfo.username);
  const newRefreshToken = generarRefreshToken();

  // Guardamos nuevo refresh con 1 minuto de vida
  refreshTokensDB.push({
    username: tokenInfo.username,
    refreshToken: newRefreshToken,
    expires: Date.now() + 1 * 60 * 1000
  });

  console.log(`[AUTH] Refresh token renovado para ${tokenInfo.username}`);

  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});

// Logout
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  refreshTokensDB = refreshTokensDB.filter(t => t.refreshToken !== refreshToken);
  res.json({ message: 'Sesión cerrada correctamente' });
});

// Recuperar contraseña (muestra en texto plano)
router.post('/recover', async (req, res) => {
  const { username, petName } = req.body;

  try {
    const user = await User.findOne({ username, petName });
    if (!user) {
      return res.status(404).json({ message: 'Datos incorrectos' });
    }

    res.status(200).json({
      message: 'Datos validados correctamente',
      password: user.password
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
