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

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="w-full top-0 z-50 bg-orange-500 text-white py-2 sticky left-0 ">
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
        <nav className="flex items-center  text-white space-x-6 ">
        <div
          className="flex items-center gap-2 hover:text-blue-200 transition curso-pointer"
          onClick={() => navigate("/favorites")}
        >
      <Star className="w-5 h-5"  />
          <span className="text-xl font-semibold">{t("header.favorites")}</span>
        </div>

          {/* Botón para cambiar idioma */}
          <div
            className="flex items-center gap-2 hove:text-blue-200 transition cursor-pointer"
            onClick={handleClick}
          >
          <Languages className="w-5 h-5 "  />
            <span className="text-xl">{t("header.button.label")}</span>
          </div>
          
          <button
  onClick={toggleMenu}
  className="ml-[15px] mr-[80px] flex flex-col justify-between h-6 cursor-pointer bg-none border-none outline-none p-0">
  <span className={`w-[30px] h-[3px] bg-white transition-all ${isOpen ? "rotate-45 translate-x-[6px] translate-y-[6px]" : ""}`}></span>
  <span className={`w-[30px] h-[3px] bg-white transition-all ${isOpen ? "opacity-0" : ""}`}></span>
  <span className={`w-[30px] h-[3px] bg-white transition-all ${isOpen ? "-rotate-45 translate-x-[8px] -translate-y-[8px]" : ""}`}></span>
</button>

          
        </nav>
      </div>
    </header>
  );
};

export default Header;
