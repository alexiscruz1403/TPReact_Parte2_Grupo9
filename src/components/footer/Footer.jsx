import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (

    <footer className="w-full bg-orange-500 text-black py-6 text-center items-center">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center text-sm">
        {/* Desarrollado por */}
        <div className="flex-1 text-center mb-6 md:mb-0">
          <h2 className="text-lg font-bold mb-2">{t('footer.description')}</h2>
          <p>{t('footer.description')}</p>
          <p>Antueno Pablo Sebastian / FAI-4973</p>
          <p>Cruz Jesus Ramon Alexis / FAI-4582</p>
          <p>Mondaca Araceli Andrea / FAI-2147</p>
        </div>

        {/* Contacto */}
        <div className="flex-1 text-center mb-6 md:mb-0">
          <h2 className="text-lg font-bold mb-2">{t('footer.contact.title')}</h2>
          <p>Dirección Ficticia 123, Buenos Aires</p>
          <p>contacto@rutasdelmate.com</p>
          <p>+54 11 1234-5678</p>
        </div>

        {/* Redes sociales */}
        <div className="w-full flex justify-center items-center gap-6 mt-6">
          <a href="https://www.instagram.com" aria-label="Instagram" className="hover:text-gray-200 transition">
            <Instagram className="w-8 h-8 text-black" />
          </a>
          <a href="https://www.facebook.com" aria-label="Facebook" className="hover:text-gray-200 transition">
            <Facebook className="w-8 h-8 text-black" />
          </a>
          <a href="https://twitter.com" aria-label="X" className="hover:text-gray-200 transition">
            <Twitter className="w-8 h-8 text-black" />
          </a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
