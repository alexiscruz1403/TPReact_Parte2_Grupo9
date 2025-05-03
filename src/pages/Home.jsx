import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
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
      nombre: 'Lago Puelo'
    },
    {
      nombre: 'El Bolsón'
    },
    {
      nombre: 'Puerto Madryn'
    },
    {
      nombre: 'Trevelin'
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-grow">
        <div>
          <p className="text-3xl font-bold text-center mt-6">
            {t("home.title")}
          </p>
          <List items={lugares} emptyMessage={t("home.empty")} actualizarListaFavoritos={updateFavoritos}/>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
