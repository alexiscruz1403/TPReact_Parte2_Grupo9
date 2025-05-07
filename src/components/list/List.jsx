import React from "react";
import Card from "../card/Card";
import { Lightbulb } from "lucide-react";

const List = ({ items, emptyMessage, title=null, description, id, onItemClick, onFavoriteClick }) => {
  return (
    <div className="mb-8" id={id}>

      {title && <h3 className="text-2xl mt-4 mb-4">{title}</h3>}
      {description && (
        <div className="flex items-center justify-center mb-6">
          <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
          <p className="text-base italic">{description}</p>
        </div>
      )}
      {items.length > 0 ? (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              nombre={item.nombre}
              departamento={item.departamento}
              municipio={item.municipio}
              provincia={item.provincia}
              clima={item.clima}
              imagen={item.imagen}
              onClick={() => onItemClick(item)}
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