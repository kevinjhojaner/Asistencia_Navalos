// src/controllers/authController.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // <-- Importamos jsonwebtoken

// --- Función de Registro (Sin cambios) ---
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, password, name, role } = req.body;
        if (!username || !password || !name) {
            return res.status(400).json({ message: 'Faltan campos obligatorios (usuario, contraseña, nombre)' });
        }
        const existingUser = await prisma.user.findUnique({
            where: { username: username }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'El nombre de usuario ya existe' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
                name: name,
                role: role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE' 
            }
        });
        res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
            userId: newUser.id,
            username: newUser.username
        });
    } catch (error) {
        console.error('Error en registerUser:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// --- Función de Login (¡ACTUALIZADA!) ---
export const loginUser = async (req: Request, res: Response) => {
    try {
        // 1. Obtener datos (username, password)
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
        }

        // 2. Buscar al usuario en la BD por username
        const user = await prisma.user.findUnique({
            where: { username: username }
        });

        // 3. Si no existe -> Error
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 4. Comparar la contraseña ingresada con la encriptada
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // 5. Si no coincide -> Error
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' }); // 401: No autorizado
        }

        // 6. Si coincide -> Generar un token (JWT)
        const tokenPayload = {
            userId: user.id,
            username: user.username,
            role: user.role
        };

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET no está definido en .env');
        }

        const token = jwt.sign(tokenPayload, jwtSecret, {
            expiresIn: '1d' // El token expira en 1 día
        });

        // 7. Enviar el token y datos del usuario al cliente
        res.status(200).json({ 
            message: 'Login exitoso', 
            token: token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en loginUser:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};