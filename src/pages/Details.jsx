import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LoaderCircle } from "lucide-react";

const Details = () => {
  const { nombre } = useParams();
  const { t, i18n } = useTranslation();

  const [data, setData] = useState(null);
  const [clima, setClima] = useState(null);
  const [pronostico, setPronostico] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localidades, setLocalidades] = useState([]);

  const openWeatherKey = "71b490fede18d724d47d0ba570379320";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch localidad principal
        const res = await fetch(
          `https://apis.datos.gob.ar/georef/api/localidades?nombre=${nombre}&max=1`
        );
        const json = await res.json();
        const localidad = json.localidades[0];
        if (!localidad) throw new Error("Lugar no encontrado");
        setData(localidad);

        // Fetch imagen
        const wikiRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${nombre}&pithumbsize=400`
        );
        const imgData = await wikiRes.json();
        const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];
        setImagen(
          page.thumbnail?.source ||
          `https://picsum.photos/seed/${nombre}/400/300`
        );

        // Fetch clima y pronóstico
        if (localidad.centroide) {
          const { lat, lon } = localidad.centroide;

          const climaRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${openWeatherKey}`
          );
          setClima(await climaRes.json());

          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${openWeatherKey}`
          );
          const forecastData = await forecastRes.json();
          const diario = forecastData.list.filter((_, i) => i % 8 === 0);
          setPronostico(diario);
        }

        // Fetch localidades por provincia
        const locRes = await fetch(
          `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(nombre)}&max=500`
        );
        const locData = await locRes.json();
        setLocalidades(locData.localidades || []);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [nombre]);

  useEffect(() => {
    if (navigator.geolocation && data?.centroide) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lon: longitude });

        const km = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          data.centroide.lat,
          data.centroide.lon
        );
        setDistance(km.toFixed(2));
      });
    }
  }, [data]);

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const handleClick = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  if (loading) {
    return (
      <>
        <Header handleLanguageToggle={handleClick} />
        <main className="flex justify-center items-center h-80 gap-2 text-xl">
          <LoaderCircle className="animate-spin" />
          <p className="font-bold">{t("loading.text")}</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header handleLanguageToggle={handleClick} />
      <main className="flex-grow px-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold text-center">
          Detalles de {decodeURIComponent(nombre)}
        </h1>

        {imagen && (
          <div className="flex justify-center">
            <img
              src={imagen}
              alt={`Imagen de ${nombre}`}
              className="rounded shadow w-full max-w-md mx-auto"
            />
          </div>
        )}

        <div className="text-center space-y-1">
          <p>
            <strong>Provincia:</strong> {data.provincia?.nombre}
          </p>
          <p>
            <strong>Departamento:</strong> {data.departamento?.nombre || "No disponible"}
          </p>
          <p>
            <strong>Latitud:</strong> {data.centroide?.lat}
          </p>
          <p>
            <strong>Longitud:</strong> {data.centroide?.lon}
          </p>
          {distance && (
            <p className="text-blue-700 font-semibold mt-2">
              Estás a {distance} km de {nombre}
            </p>
          )}
        </div>

        <div className="text-center bg-grey-100">
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

        {pronostico && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-center">Pronóstico para los próximos días</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-center">
              {pronostico.map((dia, idx) => (
                <div key={idx} className="bg-orange-300 text-white p-4 rounded shadow text-center">
                  <p className="font-semibold">
                    {new Date(dia.dt * 1000).toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${dia.weather[0].icon}@2x.png`}
                    alt="icono"
                    className="mx-auto h-12"
                  />
                  <p className="capitalize">{dia.weather[0].description}</p>
                  <p className="text-sm">Temp: {dia.main.temp.toFixed(1)} °C</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.centroide && (
          <div className="h-96 w-full max-w-3xl mx-auto mt-8 ">
            <MapContainer
              center={[data.centroide.lat, data.centroide.lon]}
              zoom={10}
              className="h-full w-full rounded shadow"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[data.centroide.lat, data.centroide.lon]}>
                <Popup>{nombre}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {localidades.length > 0 && (
          <List
            items={localidades.map((loc) => ({
              id: loc.id,
              nombre: loc.nombre,
              provincia: loc.departamento?.nombre || "Sin departamento",
            }))}
            emptyMessage={`No se encontraron localidades para ${nombre}.`}
            title={`Localidades en la provincia de ${nombre}`}
            description={`Listado de localidades registradas.`}
            id="localidades"
            onItemClick={() => {}}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Details;
