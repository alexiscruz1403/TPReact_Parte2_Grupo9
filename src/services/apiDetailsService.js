const openWeatherKey = "71b490fede18d724d47d0ba570379320";

export const fetchProvinceData = async (name, capitals, navigate) => {
  try {
    // Fetch localidad principal
    const res = await fetch(
      `https://apis.datos.gob.ar/georef/api/localidades?provincia=${name}&nombre=${capitals[name]}&max=1`
    );
    const json = await res.json();
    if (json.total === 0) {
      navigate("/not-found", { replace: true });
      return null;
    }

    const locality = json.localidades[0];
    return {
      name: locality.nombre,
      centroide: locality.centroide,
      id: locality.id,
      province: locality.provincia?.nombre || "empty",
      department: locality.departamento?.nombre || "empty",
      municipality: locality.municipio?.nombre || "empty",
    };
  } catch (error) {
    console.error("Error al obtener datos de la provincia:", error);
    throw error;
  }
};

export const fetchProvinceImage = async (name) => {
  try {
    // Fetch imagen de Wikipedia
    // Si no hay imagen, se usa una imagen aleatoria de Lorem Picsum
    const wikiRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${encodeURIComponent(
        name
      )}&pithumbsize=400`
    );
    const imgData = await wikiRes.json();
    const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];
    return (
      page.thumbnail?.source || `https://picsum.photos/seed/${name}/400/300`
    );
  } catch (error) {
    console.error("Error al obtener la imagen de la provincia:", error);
    throw error;
  }
};

export const fetchLocalities = async (name, currentFetchIndex) => {
  try {
    // Fetch localidades de la provincia
    // Se muestran primero 10 localidades y luego se van cargando más al hacer click en "Cargar más"
    const response = await fetch(
      `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(
        name
      )}&max=10&inicio=${currentFetchIndex}`
    );
    const data = await response.json();
    return {
      total: data.total,
      localities: data.localidades
    };
  } catch (error) {
    console.error("Error al obtener las localidades:", error);
    throw error;
  }
};

export const fetchLocalityDetails = async (localities, t) => {
  try {
    const localitiesInfo = await Promise.all(
      localities.map(async (locality) => {
        // Fetch para obtener los detalles de la localidad
        const response = await fetch(
          `https://apis.datos.gob.ar/georef/api/localidades?id=${locality.id}`
        );
        const data = await response.json();
        const detailedLocality = data.localidades[0];

        if (detailedLocality.centroide) {
          const { lat, lon } = detailedLocality.centroide;

          // Fetch para obtener el clima
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${openWeatherKey}`
          );
          const weatherData = await weatherResponse.json();
          detailedLocality.clima = weatherData;

          // Fetch para obtener el pronóstico
          const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${openWeatherKey}`
          );
          const forecastData = await forecastResponse.json();
          detailedLocality.pronostico = forecastData.list[0];
        }

        return {
          name: detailedLocality.nombre,
          department: detailedLocality.departamento?.nombre || "empty",
          municipality: detailedLocality.municipio?.nombre || "empty",
          province: detailedLocality.provincia?.nombre || "empty",
          id: detailedLocality.id,
          weather: detailedLocality.clima || null,
          forecast: detailedLocality.pronostico || null,
        };
      })
    );
    return localitiesInfo;
  } catch (error) {
    console.error("Error al obtener detalles de las localidades:", error);
    throw error;
  }
};