const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { username, password, petName } = req.body;

  try {
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, petName });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login sin tokens
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Retornamos datos básicos del usuario
    res.status(200).json({ message: 'Login exitoso', username: user.username, petName: user.petName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Recuperar contraseña (solo ejemplo)
router.post('/recover', async (req, res) => {
  const { username, petName } = req.body;

  try {
    const user = await User.findOne({ username, petName });
    if (!user) {
      return res.status(404).json({ message: 'Datos incorrectos' });
    }

    res.status(200).json({
      message: 'Datos validados correctamente',
      password: user.password // NO recomendado en producción
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
