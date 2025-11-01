'use client'; 

import React, { useState } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setError(''); 
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      
      console.log('Login exitoso:', data);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // --- ¡LÍNEA AÑADIDA! ---
      // Disparamos un evento 'storage' para avisarle a la Navbar
      window.dispatchEvent(new Event("storage"));

      setIsLoading(false); 
      
      router.push('/dashboard');

    } catch (err: unknown) { 
      setIsLoading(false); 
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4"> 
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        
        <div className="flex justify-center mb-6">
          <Image 
            src="/logonavalos.png" 
            alt="Grupo Navalos Logo"
            width={150} 
            height={150}
            priority 
          />
        </div>

        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Iniciar Sesión
        </h2>
        
        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-center text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Usuario 
            </label>
            <input
              id="username" 
              name="username" 
              type="text" 
              autoComplete="username" 
              required
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
              placeholder="nombre.apellido" 
            />
          </div>

          {}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;