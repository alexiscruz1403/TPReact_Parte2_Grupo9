import React, { useEffect, useState } from 'react';

const API_KEY = '71b490fede18d724d47d0ba570379320';

const Card = ({ nombre, imagen, esFavorito, toggleFavorito }) => {
  const [data, setData] = useState(null);
  const [clima, setClima] = useState(null);

  useEffect(() => {
    const fetchLocalidad = async () => {
      try {
        const res = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?nombre=${encodeURIComponent(nombre)}`);
        const localidadData = await res.json();

        if (localidadData.localidades && localidadData.localidades.length > 0) {
          const localidad = localidadData.localidades[0];
          setData(localidad);

          // Obtener el clima de la localidad
          const climaRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(nombre)},AR&appid=${API_KEY}&units=metric&lang=es`);
          const climaData = await climaRes.json();

          if (climaData.cod === 200) {
            setClima(climaData);
          } else {
            console.error("Error al obtener datos del clima:", climaData.message);
          }
        }
      } catch (err) {
        console.error("Error al obtener localidad:", err);
      }
    };

    fetchLocalidad();
  }, [nombre]);

  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imagen} alt={nombre} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{nombre}</h2>
          <button
  onClick={() => toggleFavorito(nombre)}
  className={`text-xl ${esFavorito ? 'text-red-500' : 'text-gray-400'} ${!toggleFavorito ? 'cursor-not-allowed opacity-50' : ''}`}
  title="Agregar a favoritos"
  disabled={!toggleFavorito}
>
  {esFavorito ? '★' : '☆'}
</button>
        </div>

        {data ? (
          <>
            <p><strong>Provincia:</strong> {data.provincia.nombre}</p>
            <p><strong>Departamento:</strong> {data.departamento?.nombre || 'No disponible'}</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">Cargando datos de localidad...</p>
        )}

        {clima ? (
          <div className="mt-2">
            <p><strong>Clima:</strong> {clima.weather[0].description}</p>
            <p><strong>Temperatura:</strong> {clima.main.temp} °C</p>
            <img
              src={`https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`}
              alt="Icono clima"
              className="h-10 w-10"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-500">Cargando clima...</p>
        )}
      </div>
    </div>
  );
};

export default Card;
