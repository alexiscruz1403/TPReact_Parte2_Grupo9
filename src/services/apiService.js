export const fetchProvinces = async (topProvinces) => {
    const response = await fetch("https://apis.datos.gob.ar/georef/api/provincias?max=24");
    const data = await response.json();
  
    // Filtra provincias top 10
    const filteredProvinces = data.provincias.filter((province) =>
      topProvinces.includes(province.nombre)
    );
  
    // Fetch imágenes para cada provincia
    const provincesData = await Promise.all(
      filteredProvinces.map(async (province) => {
        const wikiResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${province.nombre}&pithumbsize=400`
        );
        const imgData = await wikiResponse.json();
        const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];

        const provinceDataStructure = {
          id: province.id,
          name: province.nombre,
          centroide: province.centroide
        }
  
        return {
          ...provinceDataStructure,
          image: page.thumbnail?.source || `https://picsum.photos/seed/${province.nombre}/400/300`,
        };
      })
    );
  
    return provincesData;
  };
  
  export const searchProvinces = async (term) => {
    const response = await fetch(
      `https://apis.datos.gob.ar/georef/api/provincias?nombre=${encodeURIComponent(term)}`
    );
    const data = await response.json();
  
    // Fetch imágenes para cada provincia
    const provincesData = await Promise.all(
      data.provincias.map(async (province) => {
        const wikiResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${province.nombre}&pithumbsize=400`
        );
        const imgData = await wikiResponse.json();
        const page = imgData.query.pages[Object.keys(imgData.query.pages)[0]];

        const provinceDataStructure = {
          id: province.id,
          name: province.nombre,
          centroide: province.centroide
        }
  
        return {
          ...provinceDataStructure,
          image: page.thumbnail?.source || `https://picsum.photos/seed/${province.nombre}/400/300`,
        };
      })
    );
  
    return provincesData;
  };