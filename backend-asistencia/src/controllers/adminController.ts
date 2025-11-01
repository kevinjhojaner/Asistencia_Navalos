import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; 
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
// CAMBIO: Añadimos RequestStatus a la importación
import { Role, RequestStatus } from '@prisma/client'; 

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
  
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        name: 'asc' 
      }
    });
    res.status(200).json(users);

  } catch (error) {
    console.error("Error en getAllUsers:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, name, role } = req.body;

    
    if (!username || !password || !name || !role) {
      return res.status(400).json({ message: 'Faltan campos (username, password, name, role)' });
    }
    if (role !== Role.ADMIN && role !== Role.EMPLOYEE) {
        return res.status(400).json({ message: 'Rol inválido. Debe ser ADMIN o EMPLOYEE' });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'El nombre de usuario ya existe' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        role: role 
      }
    });

    const { password: _, ...userResponse } = newUser; 
    res.status(201).json({ message: 'Usuario creado exitosamente', user: userResponse });

  } catch (error) {
    console.error("Error en createUser:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAttendanceReports = async (req: AuthRequest, res: Response) => {
  try {
  
    const { startDate, endDate } = req.query;

    
    let whereClause: any = {}; 

    
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      start.setHours(0, 0, 0, 0); 

      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999); 

      whereClause.clockIn = {
        gte: start, 
        lte: end,   
      };
    }

    const records = await prisma.attendanceRecord.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true, 
            username: true,
          },
        },
      },
      orderBy: {
        clockIn: 'desc',
      },
    });

    res.status(200).json(records);

  } catch (error) {
    console.error("Error en getAttendanceReports:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// --- NUEVA FUNCIÓN: Obtener TODAS las Solicitudes (Admin) ---
export const getAllLeaveRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.leaveRequest.findMany({
      // Incluimos el nombre del usuario que hizo la solicitud
      include: {
        user: {
          select: {
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        // Mostramos las pendientes primero, luego por fecha
        status: 'asc', // PENDING suele ir primero alfabéticamente
        createdAt: 'desc'
      }
    });
    res.status(200).json(requests);

  } catch (error) {
    console.error("Error en getAllLeaveRequests:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// --- NUEVA FUNCIÓN: Actualizar Estado de Solicitud (Admin) ---
export const updateLeaveRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // ID de la solicitud a actualizar
    const { status } = req.body; // Nuevo estado (APPROVED o REJECTED)

    // Validación del nuevo estado
    if (!status || (status !== RequestStatus.APPROVED && status !== RequestStatus.REJECTED)) {
      return res.status(400).json({ message: 'Estado inválido. Debe ser APPROVED o REJECTED' });
    }

    // Actualizamos la solicitud en la BD
    const updatedRequest = await prisma.leaveRequest.update({
      where: {
        id: id
      },
      data: {
        status: status
      }
    });

    res.status(200).json({ message: 'Estado de la solicitud actualizado', request: updatedRequest });

  } catch (error) {
    console.error("Error en updateLeaveRequestStatus:", error);
    // Manejo de error por si el ID no existe
    if ((error as any).code === 'P2025') { 
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};