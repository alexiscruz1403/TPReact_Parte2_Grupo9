import { useTranslation } from "react-i18next";
import { fetchProvincias, searchProvincias } from "../services/apiService";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoaderCircle, SearchX } from "lucide-react";

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
    const loadProvincias = async () => {
      try {
        const provinciasConDatos = await fetchProvincias(topProvincias);
        setProvincias(provinciasConDatos);
      } catch (error) {
        console.error("Error al obtener las provincias:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProvincias();
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
        const provinciasConDatos = await searchProvincias(term);
        setSearchResults(provinciasConDatos);
      } catch (error) {
        console.error("Error al buscar provincias:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow bg-black text-white">
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
            <div className="flex gap-1 items-center justify-center">
              <LoaderCircle className="h-6 w-6 animate-spin" />
              <p className="text-center text-lg font-semibold">
                {t("details.loading.information")}
              </p>
            </div>
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
    </div>
  );
};

export default Home;