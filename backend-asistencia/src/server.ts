// src/server.ts
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './lib/prisma'; 
import authRoutes from './routes/authRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import leaveRequestRoutes from './routes/leaveRequestRoutes';
import adminRoutes from './routes/adminRoutes'; // <-- 1. IMPORTAR RUTAS ADMIN

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba de conexión
app.get('/', async (req: Request, res: Response) => {
  try {
    await prisma.$connect();
    res.send('✅ ¡API de Asistencia funcionando y conectada a PostgreSQL (Prisma)!');
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    res.status(500).send('❌ Error al conectar a la base de datos. Revisa DATABASE_URL.');
  }
});

// --- Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/requests', leaveRequestRoutes);
app.use('/api/admin', adminRoutes); // <-- 2. USAR RUTAS ADMIN

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`⚡️[server]: Servidor de Asistencia corriendo en http://localhost:${PORT}`);
});