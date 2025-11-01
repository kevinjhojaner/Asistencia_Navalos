'use client';

import React, { useState, useEffect, useCallback } from 'react';
import withAuth from '../../../hocs/withAuth';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  createdAt: string;
}

type NewUserForm = {
  username: string;
  password: string;
  name: string;
  role: 'EMPLOYEE' | 'ADMIN';
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newUser, setNewUser] = useState<NewUserForm>({
    username: '',
    password: '',
    name: '',
    role: 'EMPLOYEE',
  });

  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
  };


  const fetchUsers = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError("Error de autenticación");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('No se pudo cargar la lista de usuarios. ¿Eres administrador?');
      }

      const data: User[] = await response.json();
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error inesperado');
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };


  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = getToken();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el usuario');
      }

      alert(`¡Usuario ${data.user.username} creado exitosamente!`);
      setNewUser({ username: '', password: '', name: '', role: 'EMPLOYEE' });
      fetchUsers(); 

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error inesperado al crear usuario');
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Gestión de Usuarios</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna 1: Formulario para Crear Usuario */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Crear Nuevo Usuario</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Nombre Completo */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input type="text" name="name" id="name" value={newUser.name} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm sm:text-sm" />
              </div>
              {/* Nombre de Usuario */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                <input type="text" name="username" id="username" value={newUser.username} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm sm:text-sm" />
              </div>
              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña Temporal</label>
                <input type="password" name="password" id="password" value={newUser.password} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm sm:text-sm" />
              </div>
              {/* Rol */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
                <select name="role" id="role" value={newUser.role} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm sm:text-sm">
                  <option value="EMPLOYEE">Empleado</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              {/* Botón */}
              <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Crear Usuario
              </button>
            </form>
          </div>
        </div>

        {/* Columna 2: Lista de Usuarios */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Lista de Usuarios</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Cargando...</td></tr>
                  ) : users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default withAuth(AdminUsersPage);