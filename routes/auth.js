// routes/auth.js
const express = require('express');
const User = require('../models/user');
const { generarAccessToken, generarRefreshToken } = require('../tokenService');

const router = express.Router();

// Almacenamiento en memoria para refresh (solo pruebas)
let refreshTokensDB = [];

// Registro (sin hash)
router.post('/register', async (req, res) => {
  const { username, password, petName } = req.body;

  try {
    if (!username || !password || !petName) {
      return res.status(400).json({ message: 'username, password y petName son requeridos' });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const newUser = new User({ username, password, petName });
    await newUser.save();

    return res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('[AUTH/register] Error:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login (sin hash) + refresh 1 minuto
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

    if (password !== user.password) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const accessToken = generarAccessToken(username);
    const refreshToken = generarRefreshToken();

    // 1 minuto
    refreshTokensDB.push({
      username,
      refreshToken,
      expires: Date.now() + 1 * 60 * 1000
    });

    console.log(`[AUTH] Login OK: ${username}`);
    return res.status(200).json({ accessToken, refreshToken, password }); // password solo debug
  } catch (err) {
    console.error('[AUTH/login] Error:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Refresh (1 minuto)
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken es requerido' });

    const tokenInfo = refreshTokensDB.find(
      t => t.refreshToken === refreshToken && t.expires > Date.now()
    );

    if (!tokenInfo) {
      return res.status(403).json({ message: 'Refresh token inválido o expirado' });
    }

    // Invalida refresh usado
    refreshTokensDB = refreshTokensDB.filter(t => t.refreshToken !== refreshToken);

    const newAccessToken = generarAccessToken(tokenInfo.username);
    const newRefreshToken = generarRefreshToken();

    refreshTokensDB.push({
      username: tokenInfo.username,
      refreshToken: newRefreshToken,
      expires: Date.now() + 1 * 60 * 1000
    });

    console.log(`[AUTH] Refresh OK: ${tokenInfo.username}`);
    return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error('[AUTH/refresh] Error:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  refreshTokensDB = refreshTokensDB.filter(t => t.refreshToken !== refreshToken);
  return res.json({ message: 'Sesión cerrada correctamente' });
});

// Recover (muestra password en texto)
router.post('/recover', async (req, res) => {
  const { username, petName } = req.body;

  try {
    const user = await User.findOne({ username, petName });
    if (!user) return res.status(404).json({ message: 'Datos incorrectos' });

    return res.status(200).json({
      message: 'Datos validados correctamente',
      password: user.password
    });
  } catch (err) {
    console.error('[AUTH/recover] Error:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
