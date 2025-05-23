import Card from "../card/Card";
import { Lightbulb } from "lucide-react";

const List = ({ items, emptyMessage, title=null, description, id, onItemClick, onFavoriteClick }) => {
  return (
    <div className="mb-8 mt-8" id={id}>

      {title && <h3 className="text-left mt-6 mb-6">{title}</h3>}
      {description && (
        <div className="flex items-center justify-center mb-6">
          <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
          <p className="text-base italic">{description}</p>
        </div>
      )}
      {items.length > 0 ? (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {items.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              name={item.name}
              department={item.department}
              municipality={item.municipality}
              province={item.province}
              weather={item.weather}
              forecast={item.forecast}
              image={item.image}
              onCardClick={onItemClick}
              onFavoriteClick={onFavoriteClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-80">
          <p className="text-2xl font-bold">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default List;