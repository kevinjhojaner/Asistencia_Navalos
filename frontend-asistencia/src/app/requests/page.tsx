'use client'; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import withAuth from '../../hocs/withAuth'; 

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string; 
  endDate: string;
  status: string;
  reason: string;
  createdAt: string;
}

const RequestsPage = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE');
  };

  useEffect(() => {
    const fetchRequests = async () => {
      const token = getToken();
      if (!token) {
        setError("Error de autenticación");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/requests', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar el historial de solicitudes');
        }

        const data: LeaveRequest[] = await response.json();
        setRequests(data); 

      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Error inesperado');
      } finally {
        setIsLoading(false); 
      }
    };

    fetchRequests();
  }, []); 

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprobada': return 'text-green-600 bg-green-100';
      case 'rechazada': return 'text-red-600 bg-red-100';
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Solicitudes de Ausencia</h1>
        <Link 
          href="/requests/new" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
        >
          + Nueva Solicitud
        </Link>
      </div>

      {/* Mensaje de Error (si existe) */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Tabla con el historial de solicitudes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Historial de Solicitudes</h2>
        <div className="overflow-x-auto"> 
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Fin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Cargando solicitudes...</td>
                </tr>
              ) : requests.length > 0 ? (
                requests.map((request) => ( 
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(request.startDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(request.endDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {/* El estado viene de la BD (PENDING, APPROVED, REJECTED) */}
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{request.reason}</td> 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No tienes solicitudes registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(RequestsPage);
