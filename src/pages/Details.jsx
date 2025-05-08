import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LoaderCircle } from "lucide-react";

const openWeatherKey = "71b490fede18d724d47d0ba570379320";

const capitals = {
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
  const { name } = useParams();
  const [provinceData, setProvinceData] = useState(null);
  const [provinceImage, setProvinceImage] = useState(null);
  const [provinceCapitalDistance, setProvinceCapitalDistance] = useState(null);
  const [newLocalities, setNewLocalities] = useState([]);
  const [currentLocalities, setCurrentLocalities] = useState([]);
  const [currentFetchIndex, setCurrentFetchIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const { t } = useTranslation();
  const firstFetch = useRef(false);

  const navigate = useNavigate();

  const fetchProvinceData = async () => {
    try {
      // Fetch localidad principal
      const res = await fetch(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=${name}&nombre=${capitals[name]}&max=1`
      );
      const json = await res.json();
      if (json.total === 0) {
        navigate("/not-found", { replace: true });
        return;
      }

      const locality = json.localidades[0];
      setProvinceData((prev) => ({
        ...prev,
        name: locality.nombre,
        centroide: locality.centroide,
        id: locality.id,
        province: locality.provincia?.nombre || "Sin provincia",
        department: locality.departamento?.nombre || "Sin departamento",
        municipality: locality.municipio?.nombre || "Sin municipio",
      }));

      // Fetch imagen
      const wikiRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${encodeURIComponent(
          name
        )}&pithumbsize=400`
      );
      const imgData = await wikiRes.json();
      const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];
      setProvinceImage(
        page.thumbnail?.source || `https://picsum.photos/seed/${name}/400/300`
      );
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const fetchLocalities = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(
          name
        )}&max=10&inicio=${currentFetchIndex}`
      );
      const data = await response.json();
      setNewLocalities(data.localidades);
      setCurrentFetchIndex((prev) => prev + 10); // Incrementar el índice para la próxima llamada
    } catch (error) {
      console.error("Error al obtener las localidades:", error);
    }
  };

  // Para evitar la doble carga, se usa un useRef para controlar la primera carga
  // de localidades. Se inicializa en false y se cambia a true después de la primera carga.
  useEffect(() => {
    const fetchAll = async () => {
      await fetchProvinceData();
      await fetchLocalities();
      setLoading(false);
    }

    if (!firstFetch.current) {
      fetchAll();
      firstFetch.current = true;
    }
  }, []);

  useEffect(() => {
    const fetchEachNewLocality = async () => {
      if (newLocalities.length === 0) {
        setFetching(false);
        return;
      }
      try {
        const newLocalitiesInfo = await Promise.all(
          newLocalities.map(async (localidad) => {
            const response = await fetch(
              `https://apis.datos.gob.ar/georef/api/localidades?id=${localidad.id}`
            );
            const data = await response.json();
            const locality = data.localidades[0];

            if (locality.centroide) {
              const { lat, lon } = locality.centroide;

              const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${openWeatherKey}`
              );
              const weatherData = await weatherResponse.json();
              locality.clima = weatherData;

              const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${openWeatherKey}`
              );
              const forecastData = await forecastResponse.json();
              locality.pronostico = forecastData.list[0];
            }
            return {
              name: locality.nombre,
              department: locality.departamento?.nombre || t("details.missing.department"),
              municipality: locality.municipio?.nombre || t("details.missing.municipality"),
              province: locality.provincia?.nombre || t("details.missing.province"),
              id: locality.id,
              weather: locality.clima || null,
              forecast: locality.pronostico || null,
            };
          })
        );
        setCurrentLocalities((prev) => [...prev, ...newLocalitiesInfo]);
        setFetching(false);
      } catch (error) {
        console.error(
          "Error al obtener la información de la localidad:",error
        );
      }
    };
    fetchEachNewLocality();
  }, [newLocalities]);

  useEffect(() => {
    if (navigator.geolocation && provinceData?.centroide) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;

        const km = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          provinceData.centroide.lat,
          provinceData.centroide.lon
        );
        setProvinceCapitalDistance(km.toFixed(2));
      });
    }
  }, [provinceData]);

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

  const changeFavoritesState = (locality) => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isFavorite = storedFavorites.some((item) => item.id === locality.id);
    if (!isFavorite) {
      storedFavorites.push(locality);
      localStorage.setItem("favorites", JSON.stringify(storedFavorites));
    } else {
      const updatedFavorites = storedFavorites.filter(
        (item) => item.id !== locality.id
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
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
            {t("details.title", { name: name.toUpperCase() })}
          </h1>
          {provinceImage && (
            <div className="flex justify-center">
              <img
                src={provinceImage}
                alt={`Imagen de ${name}`}
                className="rounded shadow w-full max-w-md mx-auto"
              />
            </div>
          )}

          <div className="text-center mt-1 space-y-1">
            <p>
              <strong>{t("details.latitude")}:</strong> {provinceData.centroide.lat}
            </p>
            <p>
              <strong>{t("details.longitude")}:</strong> {provinceData.centroide.lon}
            </p>
            {provinceCapitalDistance && (
              <p className="text-blue-700 font-semibold mt-2">
                {t("details.distance", {
                  distance: provinceCapitalDistance,
                  name: name,
                })}
              </p>
            )}
          </div>

          {provinceData?.centroide && (
            <div className="h-96 w-full max-w-3xl mx-auto mt-8 ">
              <MapContainer
                center={[provinceData.centroide.lat, provinceData.centroide.lon]}
                zoom={10}
                className="h-full w-full rounded shadow z-0"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[provinceData.centroide.lat, provinceData.centroide.lon]}>
                  <Popup>{name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          {fetching && currentLocalities.length === 0 ? (
            <div className="flex justify-center bg-grey-200 bg-black text-white items-center h-80 gap-2 text-xl">
              <LoaderCircle className="animate-spin" />
              <p className="font-bold items-center">{t("details.loading.localities")}</p>
            </div>
          ) : (
            <>
              <List
                items={currentLocalities}
                emptyMessage={t("details.list.empty")}
                title={null}
                description={`${t("details.list.description", {
                  name: name.toUpperCase(),
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
                    onClick={fetchLocalities}
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
