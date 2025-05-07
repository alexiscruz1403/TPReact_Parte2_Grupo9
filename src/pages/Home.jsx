import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SearchX } from 'lucide-react';

const API_KEY = "71b490fede18d724d47d0ba570379320";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const topProvincias = [
    "Salta",
    "Jujuy",
    "Mendoza",
    "San Luis",
    "Neuquén",
    "Córdoba",
    "Santa Cruz",
    "La Rioja",
    "San Juan",
    "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
  ];

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await fetch(
          "https://apis.datos.gob.ar/georef/api/provincias?max=24"
        );
        const data = await response.json();

        // Filtrar solo las provincias del top 10
        const provinciasFiltradas = data.provincias.filter((provincia) =>
          topProvincias.includes(provincia.nombre)
        );

        // Obtener clima e imágenes para cada provincia
        const provinciasConDatos = await Promise.all(
          provinciasFiltradas.map(async (provincia) => {
            const climaRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(
                provincia.centroide.lat
              )}&lon=${encodeURIComponent(provincia.centroide.lon)}&appid=${API_KEY}&units=metric&lang=es`
            );
            const climaData = await climaRes.json();

            const wikiRes = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${provincia.nombre}&pithumbsize=400`
            );
            const imgData = await wikiRes.json();
            const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];

            return {
              ...provincia,
              clima: climaData.cod === 200 ? climaData : null,
              imagen:
                page.thumbnail?.source ||
                `https://picsum.photos/seed/${provincia.nombre}/400/300`,
            };
          })
        );

        setProvincias(provinciasConDatos);
      } catch (error) {
        console.error("Error al obtener las provincias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvincias();
  }, []);



  const handleNavigate = (provincia) => {
    navigate(`/details/${encodeURIComponent(provincia.nombre)}`);
  };


  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 3) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://apis.datos.gob.ar/georef/api/provincias?nombre=${encodeURIComponent(
            term
          )}`
        );
        const data = await response.json();

        // Si se encontraron resultados, buscar clima e imágenes
        const provinciasConDatos = await Promise.all(
          data.provincias.map(async (provincia) => {
            const climaRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(
                provincia.centroide.lat
              )}&lon=${encodeURIComponent(provincia.centroide.lon)}&appid=${API_KEY}&units=metric&lang=es`
            );
            const climaData = await climaRes.json();

            const wikiRes = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${provincia.nombre}&pithumbsize=400`
            );
            const imgData = await wikiRes.json();
            const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];

            return {
              ...provincia,
              clima: climaData.cod === 200 ? climaData : null,
              imagen:
                page.thumbnail?.source ||
                `https://picsum.photos/seed/${provincia.nombre}/400/300`,
            };
          })
        );

        setSearchResults(provinciasConDatos);
      } catch (error) {
        console.error("Error al buscar provincias:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]); // Limpiar resultados si el término es menor a 4 caracteres
    }
  };


  return (
    <>
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mt-6">
            {t("home.title")}
          </h1>

          <div className="mt-6 mb-6">
            <input
              type="text"
              placeholder={t("home.search.placeholder")}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {loading ? (
            <p className="text-center mt-6 text-lg font-semibold">
              {t("home.loading")}
            </p>
          ) : searchResults.length === 0 && searchTerm.length > 3 ? (
            <div className="flex flex-col items-center mt-6">
              <SearchX className="text-gray-500 text-4xl mb-2" />
              <p className="text-lg text-gray-600">
                No se encontraron resultados para "{searchTerm}".
              </p>
            </div>
          ) : (
            <List
              items={searchResults.length > 0 ? searchResults : provincias}
              emptyMessage={t("home.list.empty")}
              title={t("home.list.title")}
              description={t("home.list.description")}
              id="provincias"
              onItemClick={handleNavigate}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;