import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";

const Card = ({ id, name, province = null, department = null, municipality = null, weather = null, forecast = null, image, onCardClick, onFavoriteClick }) => {
  const truncatedName = name.length > 20 ? `${name.slice(0, 20)}...` : name;
  const { t } = useTranslation();
  const checkFavorite = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return storedFavorites.some((item) => item.id === id);
  }

  const [isFavorite, setIsFavorite] = useState(checkFavorite());

  const handleFavoriteClick = (e) => {
    if(!onFavoriteClick) return;
    e.stopPropagation(); // Evita que el evento de clic se propague al contenedor padre
    onFavoriteClick({ id, name, province, department, municipality });
    setIsFavorite(!isFavorite);
  }

  const handleCardClick = (e) => {
    if(!onCardClick) return;
    e.stopPropagation(); // Evita que el evento de clic se propague al contenedor padre
    onCardClick({ id, name, province, department, municipality });
  }

  return (
    <div
      className="relative p-4 bg-orange-400 text-gray-900 rounded-lg shadow-md hover:text-white hover:bg-orange-800 transition cursor-pointer"
      onClick={handleCardClick}
    >
      {image && <img src={image} alt={name} className="w-full h-48 object-cover rounded-t-lg" />}
      <div className="p-4 ">
        <h3 className="text-lg font-semibold  ">{truncatedName}</h3>
        {province && department && municipality && (
          <>
            <p className="text-sm ">{t("card.province")}: {province}</p>
            <p className="text-sm ">{t("card.department")}: {department}</p>
            <p className="text-sm ">{t("card.municipality")}: {municipality}</p>
            <div className=" h-10 w-10 rounded-md absolute  top-1 right-1 flex items-center justify-center" onClick={handleFavoriteClick}>
              {
                isFavorite ? (
                  <Star className="h-6 w-6" color='black' fill="yellow" />
                ) : (
                  <Star className="h-6 w-6" color='black' fill=""/>
                )
              }
            </div>
          </>
        )
        }
        {weather && (
          <div className="mt-2">
            <p>
              <strong>{t("card.weather")}:</strong> {weather.weather[0].description}
            </p>
            <p>
              <strong>{t("card.temperature")}</strong> {weather.main.temp} °C
            </p>
          </div>
        )}
        {
          forecast && (
            <div className="mt-2 w-full flex justify-center items-center">
              <img 
                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                alt={forecast.weather[0].icon}
                className="w-12 h-12" 
              />
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Card;