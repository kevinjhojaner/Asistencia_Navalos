'use client'; 

import Link from 'next/link';
import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';


interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null); 
  const router = useRouter();

  
  useEffect(() => {
    
    const checkUser = () => {
      const userString = localStorage.getItem('user');
      if (userString) {
        const parsedUser: User = JSON.parse(userString);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    };

    
    checkUser();

   
    window.addEventListener('storage', checkUser);

   
    return () => {
      window.removeEventListener('storage', checkUser);
    };
  }, []); 


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    window.dispatchEvent(new Event("storage"));
    
    router.push('/login');
  };

  const userRole = user?.role;

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">

        <Link href="/" className="text-white text-xl font-bold">
          Control Asistencia
        </Link>

        {}
        <div className="space-x-4 flex items-center">

          {}
          {user ? (
            <>
              {}
              <Link href="/dashboard" className="text-gray-300 hover:text-white">
                Dashboard
              </Link>
              <Link href="/profile" className="text-gray-300 hover:text-white">
                Perfil
              </Link>
              <Link href="/requests" className="text-gray-300 hover:text-white">
                Solicitudes
              </Link>
              <Link href="/reports" className="text-gray-300 hover:text-white">
                Reportes
              </Link>
              <span className="text-gray-500">|</span>

              {}
              {userRole === 'ADMIN' && (
                <>
                  <Link href="/admin/users" className="text-yellow-400 hover:text-yellow-300">
                    Admin: Usuarios
                  </Link>
                  <Link href="/admin/reports" className="text-yellow-400 hover:text-yellow-300">
                    Admin: Reportes
                  </Link>
                   <Link href="/admin/requests" className="text-yellow-400 hover:text-yellow-300">
                    Admin: Solicitudes
                  </Link>
                  <span className="text-gray-500">|</span>
                </>
              )}

              {}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            
            
            <Link href="/login" className="text-gray-300 hover:text-white bg-blue-600 px-3 py-1 rounded">
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;