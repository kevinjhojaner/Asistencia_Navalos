// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Inicializa el cliente de Prisma una sola vez y lo exporta
const prisma = new PrismaClient();

export default prisma;