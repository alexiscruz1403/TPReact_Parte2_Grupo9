import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
import SearchInput from "../components/SearchInput/SearchInput";
import { useEffect, useState } from "react";

const Home = () => {
  const { t } = useTranslation();
  const [favoritos, setFavoritos] = useState(JSON.parse(localStorage.getItem("favoritos")) || []);

  const updateFavoritos = (nombre, estado) => {
    const storedFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    if(estado){
      const nuevoFavorito = storedFavoritos.find((fav) => fav.nombre === nombre);
      if(!nuevoFavorito){
        const newFavoritos = [...storedFavoritos, { nombre }];
        setFavoritos(newFavoritos);
      }
    }else{
      const newFavoritos = storedFavoritos.filter((fav) => fav.nombre !== nombre);
      setFavoritos(newFavoritos);
    }
  };

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const lugares = [
    {
      nombre: 'Lago Puelo',
      provincia: 'Chubut'
    },
    {
      nombre: 'El Bolsón',
      provincia: 'Catamarca'
    },
    {
      nombre: 'Puerto Madryn',
      provincia: 'Chubut'
    },
    {
      nombre: 'Trevelin',
      provincia: 'Chubut'
    }
  ];

  const [lugaresFiltrados, setLugaresFiltrados] = useState(lugares);
  const [busqueda, setBusqueda] = useState("");

  const filtrarLugares = () => {
    const lugaresFiltrados = lugares.filter((lugar) =>
      lugar.nombre.toLowerCase().includes(busqueda.toLowerCase()) || lugar.provincia.toLowerCase().includes(busqueda.toLowerCase())
    );
    setLugaresFiltrados(lugaresFiltrados);
  }

  return (
    <>
      <Header />
      <main className="flex-grow">
        <div>
          <p className="text-3xl font-bold text-center mt-6">
            {t("home.title")}
          </p>
          <SearchInput value={busqueda} onChange={setBusqueda}/>
          <List items={lugaresFiltrados} emptyMessage={t("home.empty")} actualizarListaFavoritos={updateFavoritos}/>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
