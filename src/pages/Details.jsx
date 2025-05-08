import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LoaderCircle } from "lucide-react";
import {
  fetchProvinceData,
  fetchProvinceImage,
  fetchLocalities,
  fetchLocalityDetails,
} from "../services/apiDetailsService";

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
  "Ciudad Autónoma de Buenos Aires": "Buenos Aires",
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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await fetchProvinceData(name, capitals, navigate);
        setProvinceData(data);

        const image = await fetchProvinceImage(name);
        setProvinceImage(image);

        const localities = await fetchLocalities(name, currentFetchIndex);
        setNewLocalities(localities);

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

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
      setFetching(true);
      try {
        const localitiesInfo = await fetchLocalityDetails(newLocalities, t);
        setCurrentLocalities((prev) => [...prev, ...localitiesInfo]);
        setFetching(false);
      } catch (error) {
        console.error("Error al obtener detalles de las localidades:", error);
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

  const handleLoadMoreClick = async () => {
    const newFetchIndex = currentFetchIndex + 10;
    setCurrentFetchIndex(newFetchIndex);
    const localitiesInfo = await fetchLocalities(name, newFetchIndex);
    setNewLocalities(localitiesInfo);
  }

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

          {fetching && currentLocalities.length === 0 
          ? (
            <div className="flex justify-center bg-grey-200 bg-black text-white items-center h-80 gap-2 text-xl">
              <LoaderCircle className="animate-spin" />
              <p className="font-bold items-center">{t("details.loading.localities")}</p>
            </div>
          ) 
          : (
            <>
              <List
                items={currentLocalities}
                emptyMessage={t("details.list.empty")}
                title={null}
                description={`${t("details.list.description", { name: name.toUpperCase()})}`}
                id="localidades"
                onFavoriteClick={changeFavoritesState}
              />
              {
                fetching 
                ? (
                  <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-700 transition" disabled>
                    <LoaderCircle className="animate-spin text-gray-900 dark:text-gray-400 h-8 w-8" />
                  </button>
                ) 
                : (
                  <button
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-700 transition"
                    onClick={handleLoadMoreClick}
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
