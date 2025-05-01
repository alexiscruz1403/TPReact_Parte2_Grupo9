import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Footer = () => {
 
    const { t, i18n } = useTranslation();

    const handleClick = () => {
        const newLang = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLang);
    }

  
    return (
      <footer className="w-full bg-orange-500 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h2 className="text-ms font-bold mb-2">{t('footer.title')}</h2>
            <p>{t('footer.description')}</p>
            <p>{t('footer.students.cruz')}</p>
            <p>{t('footer.students.antueno')}</p>
            <p>{t('footer.students.mondaca')}</p>
          </div>
  
          <div>
            <h2 className="text-lg font-bold mb-2">{t('footer.contact.title')}</h2>
            <p>{t('footer.contact.address')}</p>
            <p>{t('footer.contact.email')}</p>
            <p>{t('footer.contact.phone')}</p>
          </div>
        </div>
      </footer>
    );
  };
  export default Footer;