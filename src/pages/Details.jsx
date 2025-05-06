import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";

const Details = () => {
  const { nombre } = useParams(); // Nombre de la provincia
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        const response = await fetch(
          `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(nombre)}&max=500`
        );
        const data = await response.json();
        setLocalidades(data.localidades || []);
      } catch (error) {
        console.error("Error al obtener las localidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalidades();
  }, [nombre]);

  return (
    <>
      <Header />
      <main className="flex-grow px-4">
        {loading ? (
          <p className="text-center mt-6 text-lg font-semibold">
            Cargando localidades...
          </p>
        ) : (
          <List
            items={localidades.map((localidad) => ({
              id: localidad.id,
              nombre: localidad.nombre,
              provincia: localidad.departamento.nombre,
            }))}
            emptyMessage={`No se encontraron localidades para ${nombre}.`}
            title={`PROVINCIA DE ${nombre.toUpperCase()}`}
            description={`Localidades de la provincia de ${nombre}.`}
            id="localidades"
            onItemClick={() => {}}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Details;