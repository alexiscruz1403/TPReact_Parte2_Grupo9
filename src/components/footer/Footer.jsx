import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-screen bg-orange-500 text-white py-6 text-center flex flex-col items-center">
      <div className="w-full flex justify-center gap-8 text-sm">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-bold">Rutas del mate</h2>
          <div className="flex flex-col items-center gap-1">
            <p>{t('footer.description')}</p>
            <p>Antueno Pablo Sebastian / FAI-4973</p>
            <p>Cruz Jesus Ramon Alexis / FAI-4582</p>
            <p>Mondaca Araceli Andrea / FAI-2147</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-bold">{t('footer.contact.title')}</h2>
          <div className="flex flex-col items-start gap-1">
            <p>Dirección Ficticia 123, Buenos Aires</p>
            <p>contacto@rutasdelmate.com</p>
            <p>+54 11 1234-5678</p>
          </div>
        </div>
      </div>
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
    </footer>
  );
};

export default Footer;
