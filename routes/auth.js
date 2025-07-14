const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Registro (sin hasheo)
router.post('/register', async (req, res) => {
  const { username, password, petName } = req.body;

  try {
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    // Guarda la contraseña en texto plano (¡SOLO PARA PRUEBAS!)
    const newUser = new User({ username, password, petName });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login (comparación directa)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Comparación en texto plano (¡SOLO PARA PRUEBAS!)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    res.status(200).json({ message: 'Login exitoso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Recuperación (muestra contraseña en texto plano)
router.post('/recover', async (req, res) => {
  const { username, petName } = req.body;

  try {
    const user = await User.findOne({ username, petName });
    if (!user) {
      return res.status(404).json({ message: 'Datos incorrectos' });
    }

    // Devuelve la contraseña en texto plano (¡SOLO PARA PRUEBAS!)
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