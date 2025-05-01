import React, { useState } from 'react';
import Card from '../card/Card';  // Verifica que la ruta sea correcta
import Favorites from '../../pages/Favorites'; // Verifica que la ruta sea correcta

const lugares = [
  {
    nombre: 'Lago Puelo',
    imagen: 'https://picsum.photos/seed/lagopuelo/400/300'
  },
  {
    nombre: 'El Bolsón',
    imagen: 'https://picsum.photos/seed/elbolson/400/300'
  },
  {
    nombre: 'Puerto Madryn',
    imagen: 'https://picsum.photos/seed/puertomadryn/400/300'
  },
  {
    nombre: 'Trevelin',
    imagen: 'https://picsum.photos/seed/trevelin/400/300'
  }
];

const DestinosTuristicos = () => {
  const [favoritos, setFavoritos] = useState([]);

  const toggleFavorito = (nombre) => {
    setFavoritos((prev) =>
      prev.includes(nombre)
        ? prev.filter((f) => f !== nombre)
        : [...prev, nombre]
    );
  };

  return (
    <>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {lugares.map((lugar) => (
          <Card
            key={lugar.nombre}
            nombre={lugar.nombre}
            imagen={lugar.imagen}
            esFavorito={favoritos.includes(lugar.nombre)}
            toggleFavorito={toggleFavorito}
          />
        ))}
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">Favoritos</h2>
        {/* Pasamos tanto los favoritos como los lugares completos */}
        <Favorites favoritos={favoritos} lugares={lugares} toggleFavorito={toggleFavorito} />
      </div>
    </>
  );
};

export default DestinosTuristicos;
