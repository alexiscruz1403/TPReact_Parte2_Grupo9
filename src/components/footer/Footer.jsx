import React from 'react';
import { useTranslation } from 'react-i18next';

import { FaInstagram, FaFacebook, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h2 className="text-lg font-bold mb-2">Rutas del mate</h2>
          <p>Destinos turísticos en Argentina para matear.</p>
          <p>Alexis | Sebastian | Araceli</p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">Contacto</h2>
          <p>Dirección Ficticia 123, Buenos Aires</p>
          <p> contacto@rutasdelmate.com</p>
          <p> +54 11 1234-5678</p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">Redes Sociales</h2>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-pink-300"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-400"><FaFacebook /></a>
            <a href="mailto:contacto@rutasdelmate.com" className="hover:text-yellow-400"><FaEnvelope /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
