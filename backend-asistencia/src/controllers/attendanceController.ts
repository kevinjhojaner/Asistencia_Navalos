import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; 
import prisma from '../lib/prisma';
import { getTodayRange } from '../utils/dateUtils'; 

export const clockIn = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId; 
  if (!userId) return res.status(401).json({ message: 'Usuario no autorizado' });

  try {
    const { startOfDay, endOfDay } = getTodayRange(); 
    const existingRecord = await prisma.attendanceRecord.findFirst({
      where: {
        userId: userId,
        clockIn: {
          gte: startOfDay, 
          lt: endOfDay     
        }
      }
    });

    if (existingRecord) {
      return res.status(409).json({ message: 'Ya marcaste entrada hoy' }); 
    }

    const arrivalTime = new Date();
    const onTimeLimit = new Date(startOfDay);
    
    onTimeLimit.setHours(7, 46, 0); 
    
    const status = arrivalTime > onTimeLimit ? 'Tarde' : 'A Tiempo';

    const newRecord = await prisma.attendanceRecord.create({
      data: {
        userId: userId,
        clockIn: arrivalTime, 
        status: status
      }
    });

    res.status(201).json({ message: 'Entrada marcada exitosamente', record: newRecord });

  } catch (error) {
    console.error("Error en clockIn:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const clockOut = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Usuario no autorizado' });

  try {
    // 1. Buscar el registro de entrada de HOY que NO tenga salida
    const { startOfDay, endOfDay } = getTodayRange();
    const recordToUpdate = await prisma.attendanceRecord.findFirst({
      where: {
        userId: userId,
        clockIn: {
          gte: startOfDay,
          lt: endOfDay
        },
        clockOut: null // ¡Importante! Buscamos uno que no tenga salida
      }
    });

    if (!recordToUpdate) {
      return res.status(404).json({ message: 'No se encontró un registro de entrada pendiente para hoy' });
    }

    // 2. Actualizar el registro con la hora de salida
    const updatedRecord = await prisma.attendanceRecord.update({
      where: {
        id: recordToUpdate.id
      },
      data: {
        clockOut: new Date() // La hora actual
      }
    });

    res.status(200).json({ message: 'Salida marcada exitosamente', record: updatedRecord });

  } catch (error) {
    console.error("Error en clockOut:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// --- OBTENER ESTADO ACTUAL ---
export const getStatus = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Usuario no autorizado' });

  try {
    // 1. Buscar el último registro de HOY
    const { startOfDay, endOfDay } = getTodayRange();
    const latestRecord = await prisma.attendanceRecord.findFirst({
      where: {
        userId: userId,
        clockIn: {
          gte: startOfDay,
          lt: endOfDay
        },
      },
      orderBy: {
        clockIn: 'desc' // El más reciente
      }
    });

    if (!latestRecord) {
      // No ha hecho nada hoy
      return res.status(200).json({ status: 'Fuera' });
    }

    if (latestRecord.clockIn && !latestRecord.clockOut) {
      // Marcó entrada pero no salida
      return res.status(200).json({ status: 'Dentro', record: latestRecord });
    }

    // Marcó entrada Y salida
    return res.status(200).json({ status: 'Fuera (Completado)', record: latestRecord });

  } catch (error) {
    console.error("Error en getStatus:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getMyRecords = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Usuario no autorizado' });

  try {
   
    const records = await prisma.attendanceRecord.findMany({
      where: {
        userId: userId
      },
      
      orderBy: {
        clockIn: 'desc'
      },
    
    });

    res.status(200).json(records);

  } catch (error) {
    console.error("Error en getMyRecords:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};