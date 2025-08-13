// tokenService.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET_KEY = process.env.JWT_SECRET || 'clave-super-secreta-compartida';
const ISSUER = 'http://auth.backend';
const AUDIENCE = 'http://mis-servicios';
const EXPIRE_SECONDS = 10; // Access token expira en 10 segundos

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
      expiresIn: `${EXPIRE_SECONDS}s`, // expiración en segundos
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
