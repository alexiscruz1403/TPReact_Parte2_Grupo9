import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_KEY = "71b490fede18d724d47d0ba570379320";

const Card = ({ nombre, cambiarEstadoFavorito }) => {
  const [data, setData] = useState(null);
  const [clima, setClima] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [favorito, setFavorito] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://apis.datos.gob.ar/georef/api/localidades?nombre=${encodeURIComponent(
            nombre
          )}`
        );
        const localidadData = await res.json();
        if (localidadData.localidades?.length > 0) {
          const localidad = localidadData.localidades[0];
          setData(localidad);

          const climaRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
              nombre
            )},AR&appid=${API_KEY}&units=metric&lang=es`
          );
          const climaData = await climaRes.json();
          if (climaData.cod === 200) setClima(climaData);

          const wikiRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${nombre}&pithumbsize=400`
          );
          const imgData = await wikiRes.json();
          const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];
          setImagen(
            page.thumbnail?.source ||
              `https://picsum.photos/seed/${nombre}/400/300`
          );
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    setFavorito(favoritos.some((fav) => fav.nombre === nombre));
    fetchData();
  }, [nombre]);

  const handleEstadoFavorito = (e) => {
    e.preventDefault(); // importante para evitar que el Link se active al hacer click en el botón
    const nuevoEstado = !favorito;
    setFavorito(nuevoEstado);
    cambiarEstadoFavorito(nombre, nuevoEstado);
  };

  return (
    <Link
      to={`/details/${encodeURIComponent(nombre)}`}
      state={{ data, clima, imagen }}
      className="block"
    >
      <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
        {imagen && data && clima 
        ? (
          <>
            <img src={imagen} alt={nombre} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-black text-lg font-semibold">{nombre}</h2>
                <button onClick={handleEstadoFavorito} className="text-xl">
                  {favorito ? "★" : "☆"}
                </button>
              </div>
              <p className="text-black">
                <strong>Provincia:</strong> {data.provincia?.nombre}
              </p>
            </div>
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
                className="h-10 w-10 mx-auto"
              />
            </div>
          </>
        ) 
        : (
          <>
            <div className="w-full h-48 bg-gray-300 animate-pulse">

            </div>
            <div className="flex flex-col items-center gap-1 p-4">
              <div className="w-full flex gap-5 justify-between items-center">
                <div className="h-6 w-full bg-gray-300 animate-pulse"></div>
                <div className="h-10 w-20 bg-gray-300 animate-pulse">
                  
                </div>
              </div>
              <div className="h-6 w-4/5 bg-gray-300 animate-pulse">
                
              </div>
            </div>
            <div className="mt-2 flex flex-col items-center gap-1">
              <div className="h-6 w-4/5 bg-gray-300 animate-pulse">
                
              </div>
              <div className="h-6 w-4/5 bg-gray-300 animate-pulse">
                
              </div>
              <div className="bg-gray-300 animate-pulse h-10 w-10 mx-auto">

              </div>
            </div>
          </>
        )
        }
        </div>
        {/* {!data ? (
          <p className="p-4 text-gray-500">Cargando...</p>
        ) : (
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-black text-lg font-semibold">{nombre}</h2>
              <button onClick={handleEstadoFavorito} className="text-xl">
                {favorito ? "★" : "☆"}
              </button>
            </div>
            <p className="text-black">
              <strong>Provincia:</strong> {data.provincia?.nombre}
            </p>
          </div>
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
              className="h-10 w-10 mx-auto"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-500">Cargando clima...</p>
        )}
      </div> */}
    </Link>
  );
};

export default Card;
