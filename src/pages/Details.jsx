import React, { useEffect, useState, useRef } from "react";
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
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [nextFetch, setNextFetch] = useState(0);
  const [items, setItems] = useState([]);
  const firstFetch = useRef(false);
  const [fetching, setFetching] = useState(false);

  const [data, setData] = useState(null);
  const [clima, setClima] = useState(null);
  const [pronostico, setPronostico] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [distance, setDistance] = useState(null);

  const openWeatherKey = "71b490fede18d724d47d0ba570379320";

  const fetchLocalidades = async () => {
    try {
      const response = await fetch(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(
          nombre
        )}&max=10&inicio=${nextFetch}`
      );
      const data = await response.json();
      setLocalidades((prev) => [...prev, ...(data.localidades || [])]);
      setNextFetch((prev) => prev + 10); // Incrementar el índice para la próxima llamada
    } catch (error) {
      console.error("Error al obtener las localidades:", error);
    }
  };

  // Para evitar la doble carga, se usa un useRef para controlar la primera carga
  // de localidades. Se inicializa en false y se cambia a true después de la primera carga.
  useEffect(() => {
    if (!firstFetch.current) {
      fetchLocalidades();
      firstFetch.current = true;
    }
  }, []);

  useEffect(() => {
    const fetchInfoLocalidad = async () => {
      const nuevasLocalidades = localidades.filter(
        (localidad) => !items.some((item) => item.id === localidad.id)
      );
      try {
        const newItems = await Promise.all(
          nuevasLocalidades.map(async (localidad) => {
            const response = await fetch(
              `https://apis.datos.gob.ar/georef/api/localidades?id=${localidad.id}`
            );
            const data = await response.json();
            const loc = data.localidades[0];
            return {
              nombre: loc.nombre,
              departamento: loc.departamento?.nombre || "Sin departamento",
              municipio: loc.municipio?.nombre || "Sin municipio",
              provincia: loc.provincia?.nombre || "Sin provincia",
              id: loc.id,
            };
          })
        );
        setItems((prev) => [...prev, ...newItems]);
        setFetching(false);
      } catch (error) {
        console.error(
          "Error al obtener la información de la localidad:",
          error
        );
      }
    };
    fetchInfoLocalidad();
  }, [localidades]);

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
        console.log("Localidad:", localidad);
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
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
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

  const changeFavoritesState = (localidad) => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoritos")) || [];
    const isFavorite = storedFavorites.some((item) => item.id === localidad.id);
    if (!isFavorite) {
      storedFavorites.push(localidad);
      localStorage.setItem("favoritos", JSON.stringify(storedFavorites));
    } else {
      const updatedFavorites = storedFavorites.filter(
        (item) => item.id !== localidad.id
      );
      localStorage.setItem("favoritos", JSON.stringify(updatedFavorites));
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex justify-center items-center h-80 gap-2 text-xl">
          <LoaderCircle className="animate-spin" />
          <p className="font-bold">{t("details.loading")}</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow px-4 py-4">
        <h1 className="text-2xl font-bold text-center">
          {t("details.title", { name: nombre.toUpperCase() })}
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
            <strong>{t("details.province")}:</strong> {data.provincia.nombre}
          </p>
          <p>
            <strong>{t("details.department")}:</strong>{" "}
            {data.departamento.nombre || "No disponible"}
          </p>
          <p>
            <strong>{t("details.latitude")}:</strong> {data.centroide.lat}
          </p>
          <p>
            <strong>{t("details.longitude")}:</strong> {data.centroide.lon}
          </p>
          {distance && (
            <p className="text-blue-700 font-semibold mt-2">
              {t("details.distance", {
                distance: distance,
                name: nombre
              })}
            </p>
          )}
        </div>

        <div className="text-center bg-grey-100">
          {clima ? (
            <>
              <p>
                <strong>{t("details.weather")}:</strong>{" "}
                {clima.weather[0].description}
              </p>
              <p>
                <strong>{t("details.temperature")}:</strong> {clima.main.temp}{" "}
                °C
              </p>
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
            <h2 className="text-xl font-semibold mb-2 text-center">
              {t("details.forecast")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-center">
              {pronostico.map((dia, idx) => (
                <div
                  key={idx}
                  className="bg-orange-300 text-white p-4 rounded shadow text-center"
                >
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

        <List
          items={items}
          emptyMessage={t("details.list.empty")}
          title={`${t("details.list.title", { name: nombre.toUpperCase() })}`}
          description={`${t("details.list.description", {
            name: nombre.toUpperCase(),
          })}`}
          id="localidades"
          onFavoriteClick={changeFavoritesState}
        />
        <button
          onClick={() => {
            setFetching(true);
            fetchLocalidades();
          }}
        >
          {fetching ? (
            <LoaderCircle className="animate-spin h-8 w-8" />
          ) : (
            "Cargar mas"
          )}
        </button>
      </main>
      <Footer />
    </>
  );
};

export default Details;
