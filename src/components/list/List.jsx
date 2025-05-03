import React, { useState } from 'react';
import Card from '../card/Card';  // Verifica que la ruta sea correcta

const List = ({ items, emptyMessage, actualizarListaFavoritos }) => {

  return (
    <>
    {items.length !== 0 
    ? (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card
            key={item.nombre}
            nombre={item.nombre}
            cambiarEstadoFavorito={actualizarListaFavoritos}
          />
        ))}
      </div>
    )
    : (
      <div className="flex justify-center items-center h-80">
        <p className="text-2xl font-bold">{emptyMessage}</p>
      </div>
    )
    }
    </>
  );

};

export default List;
