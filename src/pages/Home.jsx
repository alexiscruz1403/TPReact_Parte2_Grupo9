import { useTranslation } from 'react-i18next';

const Home = () => {

    const { t, i18n } = useTranslation();

    const handleClick = () => {
        const newLang = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLang);
    }

    return (
        <div className="bg-red-500 p-5 flex flex-col gap-5 rounded-lg shadow-lg text-white">
            <h1>{t('home.welcome')}</h1>
            <p>{t('home.description')}</p>
            <div>
                <button onClick={handleClick}>{t('home.button.label')}</button>
            </div>
        </div>
    );
}

export default Home;