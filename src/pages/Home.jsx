import { useTranslation } from 'react-i18next';
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

import Destino from '../components/destino/Destino';

const Home = () => {

    const { t, i18n } = useTranslation();

    const handleClick = () => {
        const newLang = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLang);
    }

    return (
        <>
        
        <Header />
        <main className="flex-grow">

        <div className=" bg-red-500 p-5 flex flex-col gap-5 rounded-lg shadow-lg  text-white">
            <h1>{t('home.welcome')}</h1>
            <p>{t('home.description')}</p>
            <div>
                <button className= "text-gray-700" onClick={handleClick}>{t('home.button.label')}</button>
            </div>
        </div>
  
        <div>
  <p className="text-3xl font-bold text-center mt-6">Destinos Turísticos</p>
  <Destino /> 
</div>

        </main>
      <Footer />
    </>
        
    );
}

export default Home;