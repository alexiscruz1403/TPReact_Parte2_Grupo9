
import React from 'react';
import { Star } from 'lucide-react';
import { Languages } from 'lucide-react';

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (

    <header className="w-full top-0 z-50 bg-orange-500 text-black py-2 sticky left-0 ">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">


        {/* Logo + Home */}
        <div
          className="flex items-center gap-2 hover:text-gray-300 transition cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-full bg-orange-500 p-2 " />
          <span className="text-xl font-bold italic">RUTAS DEL MATE</span>
        </div>

        {/* Navegación */}
        <nav className="flex items-center  text-black space-x-6 ">
          <div
            className="flex items-center gap-2 hover:text-gray-300 transition curso-pointer"
            onClick={() => navigate("/favorites")}
          >
            <Star className="w-5 h-5" fill='yellow'/>
            <span className="text-xl font-semibold">{t("header.favorites")}</span>
          </div>

          {/* Botón para cambiar idioma */}
          <div

            className="flex items-center gap-2 hover:text-gray-300 transition cursor-pointer"
            onClick={handleClick}
          >
            <Languages className="w-5 h-5 " strokeWidth={2} />
            <span className="text-xl font-semibold">{t("header.button.label")}</span>
          </div>


        </nav>
      </div>
    </header>
  );
};

export default Header;
