// src/routes/leaveRequestRoutes.ts
import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { createLeaveRequest, getMyLeaveRequests } from '../controllers/leaveRequestController'; // Funciones que crearemos

const router = express.Router();

// Proteger todas las rutas de solicitudes
router.use(authMiddleware);

// Ruta para OBTENER todas mis solicitudes
// GET /api/requests/
router.get('/', getMyLeaveRequests);

// Ruta para CREAR una nueva solicitud
// POST /api/requests/
router.post('/', createLeaveRequest);

export default router;