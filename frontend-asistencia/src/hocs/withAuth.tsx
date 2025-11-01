// src/hocs/withAuth.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Este es un Componente de Orden Superior (HOC) que protege una página.
 * Comprueba si hay un token en localStorage. Si no, redirige a /login.
 */
const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  
  // Esta es la función que se devuelve, ES un componente
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); // Estado de carga

    useEffect(() => {
      // Comprobamos en el navegador si el token existe
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Si no hay token, redirigimos al login
        router.replace('/login');
      } else {
        // Si hay token, permitimos que se muestre la página
        // (Ignora el aviso de 'cascading renders' aquí, es necesario)
        setIsLoading(false);
      }
    }, [router]); // Se ejecuta solo una vez al cargar

    // Mientras comprobamos (isLoading es true), mostramos un "Cargando..."
    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center text-gray-900 dark:text-white">
          Cargando...
        </div>
      );
    }
    
    
    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;