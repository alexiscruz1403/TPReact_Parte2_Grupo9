import React, { useState } from 'react';
import { FaHome, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [idioma, setIdioma] = useState(i18n.language || 'es');

  const handleIdiomaChange = (e) => {
    const nuevoIdioma = e.target.value;
    setIdioma(nuevoIdioma);
    i18n.changeLanguage(nuevoIdioma);
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Home */}
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
          <FaHome className="text-2xl" />
          <span className="text-xl font-semibold">Rutas del mate</span>
        </div>

        {/* Navegación */}
        <nav className="flex items-center space-x-6">
          <button
            className="flex items-center space-x-2 hover:text-yellow-300 transition"
            onClick={() => navigate('/favorites')}
          >
            <FaHeart />
            <span>Favoritos</span>
          </button>

          {/* Selector de idioma */}
          <select
            value={idioma}
            onChange={handleIdiomaChange}
            className="bg-white text-blue-700 rounded px-2 py-1 focus:outline-none"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </nav>
      </div>
    </header>
  );
};

export default Header;
