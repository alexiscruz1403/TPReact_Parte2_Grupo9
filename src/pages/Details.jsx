import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const Details = () => {
  const { nombre } = useParams();
  const location = useLocation();
  const { data, clima, imagen } = location.state || {};
  const { t, i18n } = useTranslation();

  const handleClick = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      <Header handleLanguageToggle={handleClick} />
      <main className="flex-grow pt-40">
        <h1 className="text-2xl font-bold mb-4">Detalles de {decodeURIComponent(nombre)}</h1>

        {imagen && (
          <div className="mt-4 flex justify-center ">
            <img src={imagen} alt={`Imagen de ${nombre}`} className="rounded shadow w-full max-w-md  mx-auto" />
          </div>
        )}

        {!data ? (
          <p className="text-red-600">No se encontraron datos para esta localidad.</p>
        ) : (
          <div>
            <p><strong>Provincia:</strong> {data.provincia?.nombre}</p>
            <p><strong>Departamento:</strong> {data.departamento?.nombre || 'No disponible'}</p>
            <p><strong>Latitud:</strong> {data.centroide?.lat}</p>
            <p><strong>Longitud:</strong> {data.centroide?.lon}</p>
          </div>
        )}

        {clima && (
          <div className="mt-4 ">
            <p><strong>Clima:</strong> {clima.weather[0].description}</p>
            <p classNAme= "flex justify-center"><strong>Temperatura:</strong> {clima.main.temp} °C</p>
            <img
              src={`https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`}
              alt="Icono clima"
              className="h-12 w-12 flex justify-center mx-auto"
            />
          </div>
        )}

       
      </main>
      <Footer />
    </>
  );
};

export default Details;
