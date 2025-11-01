// src/controllers/leaveRequestController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; // Importamos el tipo de Request con 'user'
import prisma from '../lib/prisma';
import { RequestStatus } from '@prisma/client'; // Importamos el tipo Enum de Prisma

// --- OBTENER MIS SOLICITUDES ---
export const getMyLeaveRequests = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Usuario no autorizado' });

  try {
    const requests = await prisma.leaveRequest.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc' // Las más recientes primero
      }
    });
    res.status(200).json(requests);

  } catch (error) {
    console.error("Error en getMyLeaveRequests:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// --- CREAR NUEVA SOLICITUD ---
export const createLeaveRequest = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Usuario no autorizado' });

  try {
    const { type, startDate, endDate, reason } = req.body;

    // Validación básica
    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Creamos la solicitud en la BD
    const newRequest = await prisma.leaveRequest.create({
      data: {
        userId: userId,
        type: type,
        startDate: new Date(startDate), // Convertimos el string de fecha a objeto Date
        endDate: new Date(endDate),
        reason: reason,
        status: RequestStatus.PENDING // El estado por defecto definido en el schema
      }
    });

    res.status(201).json({ message: 'Solicitud creada exitosamente', request: newRequest });

  } catch (error) {
    console.error("Error en createLeaveRequest:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};