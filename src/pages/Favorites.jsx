import { useState, useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
import { useTranslation } from "react-i18next";

const Favorites = () => {
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

  return (
    <>
      <Header />
      <main className="flex-grow pt-40">
        <div>
          <p className="text-3xl font-bold text-center mt-6">
            {t("favorites.title")}
          </p>
          <List items={favoritos} emptyMessage={t("favorites.empty")} actualizarListaFavoritos={updateFavoritos}/>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Favorites;
