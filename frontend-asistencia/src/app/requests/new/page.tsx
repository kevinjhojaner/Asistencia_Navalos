'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import withAuth from '../../../hocs/withAuth'; 

const NewRequestPage = () => {
  const [requestType, setRequestType] = useState('Vacaciones');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); 

  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones (sin cambios)
    if (!startDate || !endDate) {
      setError('Por favor, selecciona las fechas de inicio y fin.');
      setIsLoading(false); return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      setIsLoading(false); return;
    }
    if (!reason.trim()) {
      setError('Por favor, ingresa un motivo.');
      setIsLoading(false); return;
    }
    
    const token = getToken();
    if (!token) {
      setError('Error de autenticación. Por favor, inicia sesión de nuevo.');
      setIsLoading(false); return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: requestType,
          startDate: startDate,
          endDate: endDate,
          reason: reason
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la solicitud');
      }

      alert('¡Solicitud enviada exitosamente!');
      router.push('/requests'); 

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error inesperado al enviar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Crear Nueva Solicitud de Ausencia</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-center text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Solicitud */}
          <div>
            <label htmlFor="requestType" className="block text-sm font-medium text-gray-700">Tipo de Ausencia</label>
            <select
              id="requestType"
              name="requestType"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option>Vacaciones</option>
              <option>Enfermedad</option>
              <option>Permiso Personal</option>
              <option>Otro</option>
            </select>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Motivo</label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Explica brevemente el motivo de tu solicitud..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/requests"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(NewRequestPage);