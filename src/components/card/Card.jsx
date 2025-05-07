
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Star } from "lucide-react";

const Card = ({ id, nombre, provincia = null, departamento = null, municipio = null, clima, imagen, onClick, onFavoriteClick }) => {
  const nombreTruncado = nombre.length > 20 ? `${nombre.slice(0, 20)}...` : nombre;
  const { t } = useTranslation();

  const checkFavorite = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoritos")) || [];
    return storedFavorites.some((item) => item.nombre === nombre && item.provincia === provincia && item.departamento === departamento && item.municipio === municipio);
  }

  const [isFavorite, setIsFavorite] = useState(checkFavorite());

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Evita que el evento de clic se propague al contenedor padre
    onFavoriteClick({ id, nombre, provincia, departamento, municipio });
    setIsFavorite(!isFavorite);
  }

  const handleClick = (e) => {
    e.stopPropagation(); // Evita que el evento de clic se propague al contenedor padre
    onClick();
  }

  return (
    <div
      className="relative p-4 bg-orange-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
      onClick={handleClick}
    >
      {imagen && <img src={imagen} alt={nombre} className="w-full h-48 object-cover rounded-t-lg" />}
      <div className="p-4 ">
        <h3 className="text-lg font-semibold text-black">{nombreTruncado}</h3>
        {provincia && departamento && municipio && (
          <>
            <p className="text-sm text-gray-800">{t("card.province")}: {provincia}</p>
            <p className="text-sm text-gray-800">{t("card.department")}: {departamento}</p>
            <p className="text-sm text-gray-800">{t("card.municipality")}: {municipio}</p>
            <div className=" h-10 w-10 rounded-md absolute  top-1 right-1 flex items-center justify-center" onClick={handleFavoriteClick}>
              {
                isFavorite ? (
                  <Star className="h-5 w-5" color='black' fill="yellow" />
                ) : (
                  <Star className="h-5 w-5" color='black' fill=""/>
                )
              }
            </div>
          </>
        )
        }
        {clima && (
          <div className="mt-2">
            <p className="text-gray-800">
              <strong>{t("card.weather")}:</strong> {clima.weather[0].description}
            </p>
            <p className="text-gray-800">
              <strong>{t("card.temperature")}</strong> {clima.main.temp} °C
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;