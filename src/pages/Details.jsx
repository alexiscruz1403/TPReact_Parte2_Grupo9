import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Details = () => {
  const { nombre } = useParams();
  const { t, i18n } = useTranslation();

  const [data, setData] = useState(null);
  const [clima, setClima] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);

  const openWeatherKey = '71b490fede18d724d47d0ba570379320';

  // Obtener los datos del lugar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?nombre=${nombre}&max=1`);
        const json = await res.json();
        const localidad = json.localidades[0];

        if (!localidad) throw new Error("Lugar no encontrado");

        setData(localidad);

        // Imagen
        const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${nombre}&pithumbsize=400`);
          const imgData = await wikiRes.json();
          const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];
          setImagen(page.thumbnail?.source || `https://picsum.photos/seed/${nombre}/400/300`);

        // Obtener clima si hay coordenadas
        if (localidad.centroide) {
          const climaRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${localidad.centroide.lat}&lon=${localidad.centroide.lon}&units=metric&lang=es&appid=${openWeatherKey}`
          );
          const climaData = await climaRes.json();
          setClima(climaData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [nombre]);

  // Obtener ubicación y calcular distancia
  useEffect(() => {
    if (navigator.geolocation && data?.centroide) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lon: longitude });

          const km = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            data.centroide.lat,
            data.centroide.lon
          );
          setDistance(km.toFixed(2));
        },

      );
    }
  }, [data]);

  // Haversine
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const handleClick = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  if (loading) {
    return (
      <>
        <Header handleLanguageToggle={handleClick} />
        <main className="flex-grow pt-40 px-4 text-center">
          <p className="text-xl font-bold">Cargando información...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header handleLanguageToggle={handleClick} />
      <main className="flex-grow pt-40 px-4">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Detalles de {decodeURIComponent(nombre)}
        </h1>

        {imagen && (
  <div className="mt-4 flex justify-center">
    <img
      src={imagen}
      alt={`Imagen de ${nombre}`}
      className="rounded shadow w-full max-w-md mx-auto"
    />
  </div>
)}

        <div className="mt-4 text-center">
          <p><strong>Provincia:</strong> {data.provincia?.nombre}</p>
          <p><strong>Departamento:</strong> {data.departamento?.nombre || 'No disponible'}</p>
          <p><strong>Latitud:</strong> {data.centroide?.lat}</p>
          <p><strong>Longitud:</strong> {data.centroide?.lon}</p>
          {distance && (
            <p className="text-blue-700 font-semibold mt-2">
               Estás a {distance} km de {nombre}
            </p>
          )}
        </div>

        <div className="mt-6 text-center">
          {clima ? (
            <>
              <p><strong>Clima:</strong> {clima.weather[0].description}</p>
              <p><strong>Temperatura:</strong> {clima.main.temp} °C</p>
              <img
                src={`https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`}
                alt="Icono clima"
                className="h-12 w-12 mx-auto"
              />
            </>
          ) : (
            <p>No se pudo obtener el clima.</p>
          )}
        </div>

        {/* Mapa */}
        {data?.centroide && (
          <div className="mt-8 h-96 w-full max-w-3xl mx-auto">
            <MapContainer
              center={[data.centroide.lat, data.centroide.lon]}
              zoom={10}
              className="h-full w-full rounded shadow"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[data.centroide.lat, data.centroide.lon]}>
                <Popup>{nombre}</Popup>
              </Marker>
              {userCoords && (
                <Marker position={[userCoords.lat, userCoords.lon]}>
                  <Popup>Tu ubicación</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Details;
