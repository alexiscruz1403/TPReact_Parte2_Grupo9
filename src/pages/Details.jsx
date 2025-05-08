import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const openWeatherKey = "71b490fede18d724d47d0ba570379320";

const capitalesArgentina = {
  "Buenos Aires": "La Plata",
  "Catamarca": "San Fernando del Valle de Catamarca",
  "Chaco": "Resistencia",
  "Chubut": "Rawson",
  "Córdoba": "Córdoba",
  "Corrientes": "Corrientes",
  "Entre Ríos": "Paraná",
  "Formosa": "Formosa",
  "Jujuy": "San Salvador de Jujuy",
  "La Pampa": "Santa Rosa",
  "La Rioja": "La Rioja",
  "Mendoza": "Mendoza",
  "Misiones": "Posadas",
  "Neuquén": "Neuquén",
  "Río Negro": "Viedma",
  "Salta": "Salta",
  "San Juan": "San Juan",
  "San Luis": "San Luis",
  "Santa Cruz": "Río Gallegos",
  "Santa Fe": "Santa Fe",
  "Santiago del Estero": "Santiago del Estero",
  "Tierra del Fuego, Antártida e Islas del Atlántico Sur": "Ushuaia",
  "Tucumán": "San Miguel de Tucumán",
  "Ciudad Autónoma de Buenos Aires": "Buenos Aires"
};

const Details = () => {
  const { nombre } = useParams();
  const [localidades, setLocalidades] = useState([]);
  const { t } = useTranslation();
  const [nextFetch, setNextFetch] = useState(0);
  const [items, setItems] = useState([]);
  const firstFetch = useRef(false);
  const [fetching, setFetching] = useState(false);
  
  const [data, setData] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      // Fetch localidad principal
      const res = await fetch(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=${nombre}&nombre=${capitalesArgentina[nombre]}&max=1`
      );
      const json = await res.json();
      if (json.total === 0) {
        navigate("/not-found", { replace: true });
        return;
      }

      const localidad = json.localidades[0];
      setData((prev) => ({
        ...prev,
        nombre: localidad.nombre,
        centroide: localidad.centroide,
        id: localidad.id,
        provincia: localidad.provincia?.nombre || "Sin provincia",
        departamento: localidad.departamento?.nombre || "Sin departamento",
        municipio: localidad.municipio?.nombre || "Sin municipio",
      }));

      // Fetch imagen
      const wikiRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${encodeURIComponent(
          nombre
        )}&pithumbsize=400`
      );
      const imgData = await wikiRes.json();
      const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];
      setImagen(
        page.thumbnail?.source || `https://picsum.photos/seed/${nombre}/400/300`
      );
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const fetchLocalidades = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(
          nombre
        )}&max=10&inicio=${nextFetch}`
      );
      const data = await response.json();
      setLocalidades(data.localidades);
      setNextFetch((prev) => prev + 10); // Incrementar el índice para la próxima llamada
    } catch (error) {
      console.error("Error al obtener las localidades:", error);
    }
  };

  // Para evitar la doble carga, se usa un useRef para controlar la primera carga
  // de localidades. Se inicializa en false y se cambia a true después de la primera carga.
  useEffect(() => {
    const fetchAll = async () => {
      await fetchData();
      await fetchLocalidades();
      setLoading(false);
    }

    if (!firstFetch.current) {
      fetchAll();
      firstFetch.current = true;
    }
  }, []);

  useEffect(() => {
    const fetchInfoLocalidad = async () => {
      if (localidades.length === 0) {
        setFetching(false);
        return;
      }
      try {
        const newItems = await Promise.all(
          localidades.map(async (localidad) => {
            const response = await fetch(
              `https://apis.datos.gob.ar/georef/api/localidades?id=${localidad.id}`
            );
            const data = await response.json();
            const loc = data.localidades[0];

            if (loc.centroide) {
              const { lat, lon } = loc.centroide;

              const climaRes = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${openWeatherKey}`
              );
              const dataClima = await climaRes.json();
              loc.clima = dataClima;

              const forecastRes = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${openWeatherKey}`
              );
              const forecastData = await forecastRes.json();
              const pronostico = forecastData.list[0];
              loc.pronostico = pronostico;
            }
            return {
              nombre: loc.nombre,
              departamento: loc.departamento?.nombre || "Sin departamento",
              municipio: loc.municipio?.nombre || "Sin municipio",
              provincia: loc.provincia?.nombre || "Sin provincia",
              id: loc.id,
              clima: loc.clima || null,
              pronostico: loc.diario || null,
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
    if (navigator.geolocation && data?.centroide) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;

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
        <main className="flex justify-center bg-grey-200 bg-black text-white items-center h-80 gap-2 text-xl">
          <LoaderCircle className="animate-spin" />
          <p className="font-bold items-center">{t("details.loading.information")}</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-black text-white px-4 py-4 min-h-screen p-8">
        <div className="bg-black min-h-screen p-8">
          <h1 className="text-2xl font-bold text-center mb-5">
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

          <div className="text-center mt-1 space-y-1">
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
                  name: nombre,
                })}
              </p>
            )}
          </div>

          {data?.centroide && (
            <div className="h-96 w-full max-w-3xl mx-auto mt-8 ">
              <MapContainer
                center={[data.centroide.lat, data.centroide.lon]}
                zoom={10}
                className="h-full w-full rounded shadow z-0"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[data.centroide.lat, data.centroide.lon]}>
                  <Popup>{nombre}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          {fetching && items.length === 0 ? (
            <div className="flex justify-center bg-grey-200 bg-black text-white items-center h-80 gap-2 text-xl">
              <LoaderCircle className="animate-spin" />
              <p className="font-bold items-center">{t("details.loading.localities")}</p>
            </div>
          ) : (
            <>
              <List
                items={items}
                emptyMessage={t("details.list.empty")}
                title={null}
                description={`${t("details.list.description", {
                  name: nombre.toUpperCase(),
                })}`}
                id="localidades"
                onFavoriteClick={changeFavoritesState}
              />
              {
                fetching ? (
                  <button className="text-black cursor-not-allowed" disabled>
                    <LoaderCircle className="animate-spin text-black h-8 w-8" />
                  </button>
                ) : (
                  <button
                    className="text-black border border-white z"
                    onClick={fetchLocalidades}
                  >
                    {t("details.button.load")}
                  </button>
                )
              }
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );

};

export default Details;
