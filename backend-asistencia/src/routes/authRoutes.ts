// src/routes/authRoutes.ts
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController'; // Importaremos las funciones del controlador

const router = express.Router();

// Ruta para registrar un nuevo usuario (POST /api/auth/register)
router.post('/register', registerUser);

// Ruta para iniciar sesión (POST /api/auth/login)
router.post('/login', loginUser);

export default router;