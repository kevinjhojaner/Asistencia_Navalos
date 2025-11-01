// src/app/dashboard/page.tsx
'use client'; 

import React, { useState, useEffect } from 'react';

// --- Definiciones de Tipos ---
interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AttendanceRecord {
  id: string;
  clockIn: string;
  clockOut: string | null;
  status: string;
  userId: string;
}

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState("Cargando...");
  const [lastRecords, setLastRecords] = useState<AttendanceRecord[]>([]); // <-- EMPIEZA VACÍO
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Función para obtener el Token ---
  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  // --- Funciones de formato (sin cambios) ---
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

  // --- useEffect ACTUALIZADO ---
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const parsedUser: User = JSON.parse(userString);
      setUser(parsedUser);
    }

    // Función para cargar TODOS los datos del dashboard
    const fetchDashboardData = async () => {
      const token = getToken();
      if (!token) {
        setError("Error de autenticación");
        setStatus("Fuera");
        return;
      }

      try {
        // 1. Obtener el estado actual
        const statusResponse = await fetch('http://localhost:3001/api/attendance/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!statusResponse.ok) throw new Error('No se pudo obtener el estado');
        const statusData = await statusResponse.json();
        setStatus(statusData.status.startsWith('Fuera') ? 'Fuera' : 'Dentro');

        // 2. Obtener los últimos registros
        const recordsResponse = await fetch('http://localhost:3001/api/attendance/my-records', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!recordsResponse.ok) throw new Error('No se pudo cargar el historial');
        const recordsData: AttendanceRecord[] = await recordsResponse.json();
        setLastRecords(recordsData); // <-- Actualizamos el estado con datos REALES

      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Error inesperado al cargar datos');
        setStatus("Fuera");
      }
    };

    fetchDashboardData();

  }, []); // Se ejecuta solo al cargar

  // --- Funciones handleClockIn y handleClockOut (SIN CAMBIOS) ---
  const handleClockIn = async () => {
    // ... (tu código de clock-in existente)
    const token = getToken();
    if (!token) { setError("Error de autenticación"); return; }
    setIsLoading(true); setError('');
    try {
      const response = await fetch('http://localhost:3001/api/attendance/clock-in', {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.message || 'Error al marcar entrada'); }
      setStatus('Dentro');
      alert(data.message);
      // Opcional: Recargar la lista de registros después de marcar
      // fetchDashboardData(); // (Descomentar si quieres que la tabla se actualice al instante)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    // ... (tu código de clock-out existente)
    const token = getToken();
    if (!token) { setError("Error de autenticación"); return; }
    setIsLoading(true); setError('');
    try {
      const response = await fetch('http://localhost:3001/api/attendance/clock-out', {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.message || 'Error al marcar salida'); }
      setStatus('Fuera');
      alert(data.message);
      // Opcional: Recargar la lista de registros después de marcar
      // fetchDashboardData(); // (Descomentar si quieres que la tabla se actualice al instante)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Renderizado del Componente ---
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Bienvenido, {user ? user.name : '...'} 
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* ... (Estado Actual y Botones - sin cambios) ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Estado Actual</h2>
          <span className={`px-4 py-2 rounded-full text-white font-bold ${
            status === 'Dentro' ? 'bg-green-500' : 
            status === 'Fuera' ? 'bg-red-500' : 'bg-gray-400' 
          }`}>
            {status}
          </span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-around items-center gap-4">
          <button 
            onClick={handleClockIn}
            disabled={isLoading || status === 'Dentro'}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full md:w-auto transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Marcar Entrada
          </button>
          <button 
            onClick={handleClockOut}
            disabled={isLoading || status === 'Fuera'}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg w-full md:w-auto transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Marcar Salida
          </button>
        </div>
      </div>
      
      {/* ... (Resumen Semanal - sin cambios) ... */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Resumen Semanal</h2>
        <p className="text-gray-600">Datos de resumen semanal aparecerán aquí...</p>
      </div>

      {/* Sección de Últimos Registros (ACTUALIZADA) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Últimos Registros</h2>
        <div className="overflow-x-auto"> 
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salida</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              
              {/* RENDERIZADO DINÁMICO */}
              {lastRecords.length > 0 ? (
                lastRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(record.clockIn)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(record.clockIn)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(record.clockOut)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      record.status === 'Tarde' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {record.status}
                    </td>
                  </tr>
                ))
              ) : (
            
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No hay registros de asistencia todavía.</td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;