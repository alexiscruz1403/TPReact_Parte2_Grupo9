import React from "react";

const Card = ({ nombre, provincia = null, clima, imagen, onClick }) => {
  // Truncar el nombre si excede los 20 caracteres
  const nombreTruncado = nombre.length > 20 ? `${nombre.slice(0, 20)}...` : nombre;

  return (
    <div
      className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
      onClick={onClick}
    >
      {imagen && <img src={imagen} alt={nombre} className="w-full h-48 object-cover rounded-t-lg" />}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-black">{nombreTruncado}</h3>
        {provincia && <p className="text-sm text-gray-800">Provincia: {provincia}</p>}
        {clima && (
          <div className="mt-2">
            <p className="text-gray-800">
              <strong>Clima:</strong> {clima.weather[0].description}
            </p>
            <p className="text-gray-800">
              <strong>Temperatura:</strong> {clima.main.temp} °C
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;