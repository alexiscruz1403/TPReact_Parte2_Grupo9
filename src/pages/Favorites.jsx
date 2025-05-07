import { useState, useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
import { useTranslation } from "react-i18next";

const Favorites = () => {
  const { t } = useTranslation();
  const [favoritos, setFavoritos] = useState(JSON.parse(localStorage.getItem("favoritos")) || []);

  const updateFavoritos = (localidad) => {
    const storedFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
     if(storedFavoritos.some((item) => item.id === localidad.id)) {
       const nuevosFavoritos = storedFavoritos.filter((item) => item.id !== localidad.id);
      setFavoritos(nuevosFavoritos);
    }
    else {
      const nuevosFavoritos = [...storedFavoritos, localidad];
     setFavoritos(nuevosFavoritos);
    }
  };

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <main className="flex-grow bg-black text-white">
        <div>
          <p className="text-3xl font-bold text-center mt-6">
            {t("favorites.title")}
          </p>
          <List items={favoritos} emptyMessage={t("favorites.empty")} onFavoriteClick={updateFavoritos}/>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
