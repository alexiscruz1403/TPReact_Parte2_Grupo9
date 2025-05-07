export const fetchProvincias = async (topProvincias) => {
    const response = await fetch("https://apis.datos.gob.ar/georef/api/provincias?max=24");
    const data = await response.json();
  
    // Filtra provincias top 10
    const provinciasFiltradas = data.provincias.filter((provincia) =>
      topProvincias.includes(provincia.nombre)
    );
  
    // Fetch imágenes para cada provincia
    const provinciasConDatos = await Promise.all(
      provinciasFiltradas.map(async (provincia) => {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${provincia.nombre}&pithumbsize=400`
        );
        const imgData = await wikiRes.json();
        const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];
  
        return {
          ...provincia,
          imagen: page.thumbnail?.source || `https://picsum.photos/seed/${provincia.nombre}/400/300`,
        };
      })
    );
  
    return provinciasConDatos;
  };
  
  export const searchProvincias = async (term) => {
    const response = await fetch(
      `https://apis.datos.gob.ar/georef/api/provincias?nombre=${encodeURIComponent(term)}`
    );
    const data = await response.json();
  
    // Fetch imágenes para cada provincia
    const provinciasConDatos = await Promise.all(
      data.provincias.map(async (provincia) => {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${provincia.nombre}&pithumbsize=400`
        );
        const imgData = await wikiRes.json();
        const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];
  
        return {
          ...provincia,
          imagen: page.thumbnail?.source || `https://picsum.photos/seed/${provincia.nombre}/400/300`,
        };
      })
    );
  
    return provinciasConDatos;
  };