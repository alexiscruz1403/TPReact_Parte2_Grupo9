import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-orange-500 text-white py-6 mt-12 text-center items-center">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h2 className="text-lg font-bold mb-2">Rutas del mate</h2>
          <p>{t('footer.description')}</p>
          <p>Antueno Pablo Sebastian / FAI-4973</p>
          <p>Cruz Jesus Ramon Alexis / FAI-4582</p>
          <p>Mondaca Araceli Andrea / FAI-2147</p>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-lg font-bold mb-2">{t('footer.contact.title')}</h2>
          <p>Dirección Ficticia 123, Buenos Aires</p>
          <p>contacto@rutasdelmate.com</p>
          <p>+54 11 1234-5678</p>

          {/* Redes sociales */}
          <div className="flex justify-center md:justify-start items-center gap-6 mt-6 text-white">
            <a href="https://www.instagram.com"   aria-label="Instagram" className="hover:text-gray-200 transition">
              <Instagram className="w-8 h-8 text-white" />
            </a>
            <a href="https://www.facebook.com"   aria-label="Facebook" className="hover:text-gray-200 transition">
              <Facebook className="w-8 h-8 text-white" />
            </a>
            <a href="https://twitter.com"   aria-label="X" className="hover:text-gray-200 transition">
              <Twitter className="w-8 h-8 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
