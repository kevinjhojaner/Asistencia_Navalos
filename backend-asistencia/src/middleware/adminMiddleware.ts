// src/middleware/adminMiddleware.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware'; // Importamos el tipo de Request que ya tiene 'user'

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {

  // authMiddleware ya debió cargar al usuario en req.user
  // Verificamos si el usuario existe Y si su rol es 'ADMIN'
  if (!req.user || req.user.role !== 'ADMIN') {
    // 403: Prohibido (Estás logueado, pero no tienes permiso)
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }

  // Si es ADMIN, dejamos que continúe
  next();
};