const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET_KEY = process.env.JWT_SECRET || 'clave-super-secreta-compartida';
const ISSUER = 'http://auth.backend';
const AUDIENCE = 'http://mis-servicios';
const EXPIRE_MINUTES = 5;

const generarAccessToken = (username) => {
  return jwt.sign(
    {
      username,
      servicio: 'MicroservicioLibros'  
    },
    SECRET_KEY,
    {
      expiresIn: `${EXPIRE_MINUTES}m`,
      issuer: ISSUER,
      audience: AUDIENCE
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
