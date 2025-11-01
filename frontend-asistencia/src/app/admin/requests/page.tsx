'use client';

import React, { useState, useEffect, useCallback } from 'react';
import withAuth from '../../../hocs/withAuth'; 

interface RequestUser {
  name: string;
  username: string;
}

interface AdminLeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; 
  reason: string;
  user: RequestUser; 
}

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState<AdminLeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE');
  };

  const getStatusColor = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const fetchRequests = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError("Error de autenticación");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/admin/requests', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('No se pudo cargar la lista de solicitudes.');

      const data: AdminLeaveRequest[] = await response.json();
      setRequests(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error inesperado');
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateStatus = async (requestId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    const token = getToken();
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/api/admin/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar la solicitud');
      }

      setRequests(currentRequests =>
        currentRequests.map(req =>
          req.id === requestId ? { ...req, status: data.request.status } : req
        )
      );
      alert('Estado de la solicitud actualizado');

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error inesperado al actualizar');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Aprobación de Solicitudes</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Tabla Detallada */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Solicitudes Pendientes y Recientes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">{
              isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Cargando solicitudes...</td>
                </tr>
              ) : requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id}>
                    {/* Celda Nueva: Nombre del Usuario */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{request.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    {/* Celda Nueva: Acciones (Aprobar/Rechazar) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'PENDING' ? (
                        <div className="flex gap-4">
                          <button 
                            onClick={() => handleUpdateStatus(request.id, 'APPROVED')}
                            className="text-green-600 hover:text-green-900 transition duration-150"
                          >
                            Aprobar
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(request.id, 'REJECTED')}
                            className="text-red-600 hover:text-red-900 transition duration-150"
                          >
                            Rechazar
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">Revisada</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No hay solicitudes para mostrar.</td>
                </tr>
              )
            }</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AdminRequestsPage);