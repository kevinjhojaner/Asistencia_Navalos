'use client';

import React, { useState, useEffect, useCallback } from 'react';
import withAuth from '../../../hocs/withAuth'; 

interface ReportUser {
  name: string;
  username: string;
}

interface AdminReportRecord {
  id: string;
  clockIn: string;
  clockOut: string | null;
  status: string;
  user: ReportUser;
}

const AdminReportsPage = () => {
  const [records, setRecords] = useState<AdminReportRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const formatTime = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('es-PE', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-PE');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'a tiempo': return 'text-green-600';
      case 'tarde': return 'text-red-600';
      case 'ausente': return 'text-gray-500';
      default: return 'text-gray-900';
    }
  };

  const fetchReports = useCallback(async (start: string, end: string) => {
    const token = getToken();
    if (!token) {
      setError("Error de autenticación");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);

      const response = await fetch(`http://localhost:3001/api/admin/reports/all?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('No se pudo cargar la lista de reportes.');
      }

      const data: AdminReportRecord[] = await response.json();
      setRecords(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error inesperado');
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    
    fetchReports('', ''); 
  }, [fetchReports]); 


  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    fetchReports(startDate, endDate);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Reportes Generales de Asistencia</h1>

      {/* Mensaje de Error (si existe) */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Sección de Filtros (¡AHORA FUNCIONAL!) */}
      <form onSubmit={handleFilterSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center">
        <h2 className="text-lg font-semibold text-gray-700 mr-4">Filtrar por Fecha:</h2>
        <div>
          <label htmlFor="startDate" className="text-sm font-medium text-gray-500 mr-2">Desde:</label>
          <input 
            type="date" 
            id="startDate" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="text-sm font-medium text-gray-500 mr-2">Hasta:</label>
          <input 
            type="date" 
            id="endDate" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-900"
          />
        </div>
        <button 
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Aplicar Filtro'}
        </button>
      </form>
      
      {/* Tabla Detallada (¡AHORA ES DINÁMICA!) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Historial Detallado</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Columna Nueva: Usuario */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salida</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">{
              isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Cargando historial...</td>
                </tr>
              ) : records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id}>
                    {/* Celda Nueva: Nombre del Usuario */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(record.clockIn)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(record.clockIn)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(record.clockOut)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No hay registros para el filtro seleccionado.</td>
                </tr>
              )
            }</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AdminReportsPage);