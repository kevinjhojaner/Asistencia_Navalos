// src/routes/attendanceRoutes.ts
import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
// AÑADIMOS 'getMyRecords' A LA IMPORTACIÓN
import { clockIn, clockOut, getStatus, getMyRecords } from '../controllers/attendanceController';

const router = express.Router();

// Todas las rutas están protegidas por el guardián (authMiddleware)
router.post('/clock-in', authMiddleware, clockIn);
router.post('/clock-out', authMiddleware, clockOut);
router.get('/status', authMiddleware, getStatus);

// --- RUTA NUEVA ---
// Ruta para obtener todos los registros del usuario logueado
router.get('/my-records', authMiddleware, getMyRecords);

export default router;