// tokenService.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Debe coincidir EXACTAMENTE con appsettings.json (.NET)
const SECRET_KEY = process.env.JWT_SECRET || 'clave_super_secreto_con_mas_bits_y_seguridad_2025!';

const ISSUER = 'http://auth.backend';
const AUDIENCE = 'http://mis-servicios';

// Access token de prueba: 10 segundos
const ACCESS_EXPIRE_SECONDS = 10;

const generarAccessToken = (username) => {
  return jwt.sign(
    {
      sub: username,
      iss: ISSUER,
      aud: AUDIENCE,
      servicio: 'MicroservicioLibros'
    },
    SECRET_KEY,
    {
      expiresIn: `${ACCESS_EXPIRE_SECONDS}s`,
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithm: 'HS256'
    }
  );
};

const generarRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

module.exports = {
  generarAccessToken,
  generarRefreshToken
};
