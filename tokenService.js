const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET_KEY = process.env.JWT_SECRET || 'clave-super-secreta-compartida';
const EXPIRE_MINUTES = 5;
const REFRESH_TTL_MINUTES = 60 * 24;

const generarAccessToken = (username) => {
  return jwt.sign(
    { servicio: username },
    SECRET_KEY,
    {
      expiresIn: `${EXPIRE_MINUTES}m`,
      issuer: 'http://auth.backend',
      audience: 'http://mis-servicios'
    }
  );
};

const generarRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

module.exports = { generarAccessToken, generarRefreshToken };
