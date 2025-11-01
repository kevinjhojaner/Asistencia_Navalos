// src/app/profile/page.tsx
'use client'; 

import React, { useState, useEffect } from 'react';
import withAuth from '../../hocs/withAuth'; // Protegemos la ruta

// Definimos el tipo de Usuario
interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);

  // useEffect para leer los datos del usuario desde localStorage
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      // Esta es la forma más robusta de tipar
      const parsedUser: User = JSON.parse(userString);
      setUser(parsedUser);
    }
  }, []); // Se ejecuta solo una vez

  // Datos de ejemplo para el horario (actualizado a 7:45)
  const schedule = "Lunes a Viernes, 7:45 AM - 4:30 PM";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Mi Perfil</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"> 
        <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-3">Información Personal</h2>

        {!user ? (
          <p className="text-gray-500">Cargando información del perfil...</p>
        ) : (
          <div className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Nombre Completo</label>
              <p className="mt-1 text-lg text-gray-900">{user.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Usuario</label>
              <p className="mt-1 text-lg text-gray-900">{user.username}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Rol</label>
              <p className="mt-1 text-lg text-gray-900">{user.role}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Horario Asignado</label>
              <p className="mt-1 text-lg text-gray-900">{schedule}</p>
            </div>

            <div className="pt-4"> 
              <button 
                disabled 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Editar Perfil (Próximamente)
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(ProfilePage);