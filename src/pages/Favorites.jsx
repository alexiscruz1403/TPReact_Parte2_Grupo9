import React from 'react';
import Card from "../components/Card/Card";

  const Favorites = ({ favoritos, lugares, toggleFavorito }) => {
    const lugaresFavoritos = lugares.filter(lugar => favoritos.includes(lugar.nombre));
  
    if (lugaresFavoritos.length === 0) {
      return <p className="text-gray-500">No hay destinos favoritos.</p>;
    }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {lugaresFavoritos.map((lugar) => (
      <Card
        key={lugar.nombre}
        nombre={lugar.nombre}
        imagen={lugar.imagen}
        esFavorito={true}
        toggleFavorito={toggleFavorito}
        />
      ))}
    </div>
  );
};

export default Favorites;


