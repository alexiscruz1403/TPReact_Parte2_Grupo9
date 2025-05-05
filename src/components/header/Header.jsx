import React from 'react';
import { House } from 'lucide-react';
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

  return (
    <header className="w-full top-0 z-50 bg-orange-500 text-white py-2 fixed left-0 ">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      

        {/* Logo + Home */}
       <div
               className="flex items-center gap-2 hover:text-blue-200 transition cursor-pointer"
               onClick={() => navigate("/")}
              >
          <House className="w-5 h-5" />
          <span className="text-xl font-semibold">{t("header.title")}</span>
        </div>

        {/* Navegación */}
        <nav className="flex items-center  text-gray-700 space-x-6 ">
        <button
          className="flex items-center gap-2 text-gray-700 bg-white text-blue-700 rounded px-2 py-1 transition focus:outline-none hover:text-blue-200 group"
          onClick={() => navigate("/favorites")}
        >
      <Star className="w-5 h-5 text-black transition group-hover:text-blue-200" />
          {t("header.favorites")}
        </button>

          {/* Botón para cambiar idioma */}
          <button
            className="flex items-center gap-2 text-gray-700 bg-white text-blue-700 rounded px-2 py-1 transition focus:outline-none hover:text-blue-200 group"
            onClick={handleClick}
          >
          <Languages className="w-5 h-5 text-black transition group-hover:text-blue-200"  />
            {t("header.button.label")}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
