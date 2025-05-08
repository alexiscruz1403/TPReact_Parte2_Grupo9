import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { CloudOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen text-orange-300 bg-[#0a0b0b]">
        <h1 className="text-3xl font-bold mb-4">{t("notFound.title")}</h1>
        <img className="w-120 h-auto mb-4" src="/404-not-found.png" alt="Imagen de resultados no encontrados" />
        <p className="text-lg mb-4">{t("notFound.description")}</p>
        <CloudOff className="w-12 h-12" />
      </div>
      <Footer />
    </>
  );
};

export default NotFound;