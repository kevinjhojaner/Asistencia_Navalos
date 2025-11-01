'use client'; 

import React, { useState, useEffect } from 'react';
import withAuth from '../../hocs/withAuth'; 


interface AttendanceRecord {
  id: string;
  clockIn: string;
  clockOut: string | null;
  status: string;
  userId: string;
}

const ReportsPage = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]); 
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
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
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

  useEffect(() => {
    const fetchReports = async () => {
      const token = getToken();
      if (!token) {
        setError("Error de autenticación");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/attendance/my-records', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar el historial de reportes');
        }

        const data: AttendanceRecord[] = await response.json();
        setAttendanceData(data); 

      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Error inesperado');
      } finally {
        setIsLoading(false); 
      }
    };

    fetchReports();
  }, []); 

  const filteredData = attendanceData; 

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Mis Reportes de Asistencia</h1>

      {/* Sección de Filtros (Placeholder) */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center">
        <h2 className="text-lg font-semibold text-gray-700 mr-4">Filtrar por Fecha:</h2>
        <div>
          <label htmlFor="startDate" className="text-sm font-medium text-gray-500 mr-2">Desde:</label>
          <input 
            type="date" 
            id="startDate" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="text-sm font-medium text-gray-500 mr-2">Hasta:</label>
          <input 
            type="date" 
            id="endDate" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          />
        </div>
        <button 
          className="px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
        >
          Aplicar Filtro
        </button>
      </div>

      {/* Mensaje de Error (si existe) */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Sección de Estadísticas Clave (Placeholders) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Días Presente</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">...</p>
          </div>
           <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Tardanzas</h3>
              <p className="mt-1 text-2xl font-semibold text-red-600">...</p> 
          </div>
           <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Horas Totales</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">...</p>
          </div>
      </div>

      {/* Tabla Detallada */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Historial Detallado</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salida</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            
            {/* CORRECCIÓN AQUÍ: 
              La lógica condicional empieza INMEDIATAMENTE después de <tbody>
              sin espacios en blanco ni comentarios entre ellos.
            */}
            <tbody className="bg-white divide-y divide-gray-200">
            {
              isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Cargando historial...</td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(record.clockIn)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(record.clockIn)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(record.clockOut)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">...</td> {/* (Horas pendiente) */}
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No hay registros en el rango seleccionado.</td>
                </tr>
              )
            }</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ReportsPage);