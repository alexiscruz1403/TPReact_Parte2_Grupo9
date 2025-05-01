import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="w-full top-0 z-50 bg-orange-500 text-white shadow-md py-2">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      {/* Logo + Home */}
      <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
        <span className="text-xl font-semibold">{t('header.title')}</span>
      </div>

      {/* Navegación */}
      <nav className="flex items-center text-gray-700 space-x-6">
        <button
          className="hover:text-blue-300 transition"
          onClick={() => navigate('/favorites')}
        >
          {t('header.favorites')}
        </button>

         {/* Botón para cambiar idioma */}
         <button 
            className="text-gray-700 bg-white text-blue-700 rounded px-2 py-1 focus:outline-none"
            onClick={handleClick}
          >
            {t('home.button.label')}
          </button>
      </nav>
    </div>
  </header>
);
};

export default Header;

