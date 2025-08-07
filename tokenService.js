// tokenService.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Puedes establecer estas variables en tu entorno o usar estos valores por defecto
const SECRET_KEY = process.env.JWT_SECRET || 'clave-super-secreta-compartida';
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET || 'clave-refresco-secreta';

const ISSUER = 'http://auth.backend';
const AUDIENCE = 'http://mis-servicios';

const EXPIRE_MINUTES = 5;
const REFRESH_TTL_MINUTES = 60 * 24 * 7; // 7 días

// Genera un access token JWT con duración corta
const generarAccessToken = (username) => {
  return jwt.sign(
    { username },
    SECRET_KEY,
    {
      expiresIn: `${EXPIRE_MINUTES}m`,
      issuer: ISSUER,
      audience: AUDIENCE
    }
  );
};

// Genera un refresh token seguro y aleatorio
const generarRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Verifica y decodifica el access token
const verificarAccessToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY, {
      issuer: ISSUER,
      audience: AUDIENCE
    });
  } catch (err) {
    return null;
  }
};

module.exports = {
  generarAccessToken,
  generarRefreshToken,
  verificarAccessToken
};
