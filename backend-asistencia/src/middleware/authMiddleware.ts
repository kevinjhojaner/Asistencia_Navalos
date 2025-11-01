import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos el tipo 'Request' de Express para añadir nuestra propiedad 'user'
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
    role: string;
  };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Obtener el token del encabezado 'Authorization'
  const authHeader = req.headers['authorization'];
  // El formato es "Bearer TOKEN_LARGO"
  const token = authHeader && authHeader.split(' ')[1]; // Obtenemos solo el TOKEN

  // 2. Si no hay token, rechazamos
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' }); // 401: No autorizado
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ message: 'Error interno: Secreto JWT no configurado' });
  }

  try {
    // 3. Verificar si el token es válido
    const decodedPayload = jwt.verify(token, jwtSecret);

    // 4. Si es válido, adjuntamos los datos del usuario a la petición (req)
    req.user = decodedPayload as AuthRequest['user'];

    // 5. Dejamos que la petición continúe
    next();
  } catch (error) {
    // 5. Si el token es inválido o expiró
    return res.status(403).json({ message: 'Token inválido.' }); // 403: Prohibido
  }
};

export default authMiddleware;