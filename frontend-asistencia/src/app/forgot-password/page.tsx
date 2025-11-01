'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const [emailOrUser, setEmailOrUser] = useState('');
  const [message, setMessage] = useState(''); 

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    console.log('Solicitando recuperación para:', emailOrUser);

  
    if (!emailOrUser.trim()) {
      setMessage('Por favor, ingresa tu usuario o correo electrónico.');
      return;
    }


    setMessage('Si el usuario/correo existe, recibirás instrucciones para restablecer tu contraseña.');
    setEmailOrUser(''); 
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Recuperar Contraseña
        </h2>

        {message && (
          <p className="mb-4 rounded bg-blue-100 p-3 text-center text-blue-700">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="emailOrUser"
              className="block text-sm font-medium text-gray-700"
            >
              Usuario o Correo Electrónico
            </label>
            <input
              id="emailOrUser"
              name="emailOrUser"
              type="text" 
              required
              value={emailOrUser}
              onChange={(e) => setEmailOrUser(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="tu.usuario o tu@correo.com"
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Enviar Instrucciones
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Recordaste tu contraseña?{' '}
          <Link href="/login"
             className="font-medium text-indigo-600 hover:text-indigo-500">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;