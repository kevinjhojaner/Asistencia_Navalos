import Link from 'next/link'; 
import Image from 'next/image'; 

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center px-4"> {/* Ajusta min-h si tu navbar/padding es diferente */}

      {}
      <div className="mb-8">
        <Image
          src="/logonavalos.png" 
          alt="Grupo Navalos Logo"
          width={180}
          height={180}
          priority
        />
      </div>

      {}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Bienvenido al Sistema de Control de Asistencia
      </h1>

      {}
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
        Gestiona tus horarios y registros de manera eficiente. Inicia sesión para acceder a tu dashboard.
      </p>

      {}
      <Link 
        href="/login" 
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
      >
        Iniciar Sesión
      </Link>

    </div>
  );
}