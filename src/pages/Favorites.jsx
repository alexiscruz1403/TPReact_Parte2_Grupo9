import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Favorites = () => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || []);

  const updateFavorites = (locality) => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if(storedFavorites.some((item) => item.id === locality.id)) {
      const newFavorites = storedFavorites.filter((item) => item.id !== locality.id);
      setFavorites(newFavorites);
    }
    else {
      const newFavorites = [...storedFavorites, locality];
      setFavorites(newFavorites);
    }
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <main className="flex-grow bg-black text-white">
        <div>
          <p className="text-3xl font-bold text-center mt-6">
            {t("favorites.title")}
          </p>
          <List items={favorites} emptyMessage={t("favorites.empty")} onFavoriteClick={updateFavorites}/>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
