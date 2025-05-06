import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import List from "../components/list/List";
import SearchInput from "../components/SearchInput/SearchInput";
import { useEffect, useState } from "react";

const Home = () => {
  const { t } = useTranslation();
  const [favoritos, setFavoritos] = useState(JSON.parse(localStorage.getItem("favoritos")) || []);

  const updateFavoritos = (nombre, estado) => {
    const storedFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    if(estado){
      const nuevoFavorito = storedFavoritos.find((fav) => fav.nombre === nombre);
      if(!nuevoFavorito){
        const newFavoritos = [...storedFavoritos, { nombre }];
        setFavoritos(newFavoritos);
      }
    }else{
      const newFavoritos = storedFavoritos.filter((fav) => fav.nombre !== nombre);
      setFavoritos(newFavoritos);
    }
  };

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const lugares = [
    {
      nombre: 'Lago Puelo',
      provincia: 'Chubut'
    },
    {
      nombre: 'El Bolsón',
      provincia: 'Catamarca'
    },
    {
      nombre: 'Puerto Madryn',
      provincia: 'Chubut'
    },
    {
      nombre: 'Trevelin',
      provincia: 'Chubut'
    }
  ];

  const [lugaresFiltrados, setLugaresFiltrados] = useState(lugares);
  const [busqueda, setBusqueda] = useState("");

  const filtrarLugares = () => {
    const lugaresFiltrados = lugares.filter((lugar) =>
      lugar.nombre.toLowerCase().includes(busqueda.toLowerCase()) || lugar.provincia.toLowerCase().includes(busqueda.toLowerCase())
    );
    setLugaresFiltrados(lugaresFiltrados);
  }

  return (
    <>
      <Header />
      <div class="w-screen h-screen bg-[url('https://media.giphy.com/media/B6kCXTy92q6kToxuS0/giphy.gif?cid=ecf05e47seveb6d38g4lvxpxkv47zf50cdkdukgo12bz1dap&ep=v1_gifs_related&rid=giphy.gif&ct=g')] bg-cover bg-center bg-no-repeat bg-fixed relative backdrop-blur-sm">

      <main className="w-full flex-grow justify-center items-center">
        <div className="flex flex-col items-center justify-center  p-12">
          <p className="text-3xl font-bold text-center mt-6">
            {t("home.title")}
          </p>
          <SearchInput value={busqueda} onChange={setBusqueda}/>
          <List items={lugaresFiltrados} emptyMessage={t("home.empty")} actualizarListaFavoritos={updateFavoritos}/>
        </div>
        
      </main>
</div>
      <Footer />
    </>
  );
};

export default Home;
