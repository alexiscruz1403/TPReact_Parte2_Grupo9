import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_KEY = "71b490fede18d724d47d0ba570379320";

const Card = ({ nombre, cambiarEstadoFavorito }) => {
  const esFavorito = () => {
    const listaFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    return listaFavoritos.some((fav) => fav.nombre === nombre);
  }

  const [data, setData] = useState(null);
  const [clima, setClima] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [favorito, setFavorito] = useState(esFavorito());

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLocalidad = async () => {
      try {
        const res = await fetch(
          `https://apis.datos.gob.ar/georef/api/localidades?nombre=${encodeURIComponent(
            nombre
          )}`
        );
        const localidadData = await res.json();

        if (localidadData.localidades && localidadData.localidades.length > 0) {
          const localidad = localidadData.localidades[0];
          setData(localidad);

          //Obtener la imagen de la localidad
          const imgSrc = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${nombre}&pithumbsize=400`
          );
          const imgData = await imgSrc.json();
          const pages = imgData.query.pages;
          const pageId = Object.keys(pages)[0];
          const imgUrl = pages[pageId].thumbnail ? pages[pageId].thumbnail.source : null;
          if(imgUrl) {
            setImagen(imgUrl);
          }else{
            setImagen(`https://picsum.photos/seed/${nombre}/400/300`);
          }

          // Obtener el clima de la localidad
          const climaRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
              nombre
            )},AR&appid=${API_KEY}&units=metric&lang=es`
          );
          const climaData = await climaRes.json();

          if (climaData.cod === 200) {
            setClima(climaData);
          } else {
            console.error(
              "Error al obtener datos del clima:",
              climaData.message
            );
          }
        }
      } catch (err) {
        console.error("Error al obtener localidad:", err);
      }
    };

    fetchLocalidad();
  }, []);

  const handleEstadoFavorito = () => {
    setFavorito(!favorito);
    cambiarEstadoFavorito(nombre, !favorito);
  }

  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imagen} alt={nombre} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-black text-lg font-semibold">{nombre}</h2>
          <button
            onClick={handleEstadoFavorito}
            className={`text-xl`}
            title="Agregar a favoritos"
          >
            {favorito ? "★" : "☆"}
          </button>
        </div>

        {data ? (
          <div className="flex flex-col gap-1 text-left text-black">
            <p>
              <strong>Provincia:</strong> {data.provincia.nombre}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Cargando datos de localidad...
          </p>
        )}

        {clima ? (
          <div className="mt-2">
            <p>
              <strong>Clima:</strong> {clima.weather[0].description}
            </p>
            <p>
              <strong>Temperatura:</strong> {clima.main.temp} °C
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`}
              alt="Icono clima"
              className="h-10 w-10"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-500">Cargando clima...</p>
        )}

        <button onClick={() => {navigate(`details/${nombre}`)}}>{t('card.button.label')}</button>
      </div>
    </div>
  );
};

export default Card;
