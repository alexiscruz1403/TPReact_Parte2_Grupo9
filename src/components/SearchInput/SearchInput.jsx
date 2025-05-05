import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const SearchInput = ({ value, onChange }) => {
    const { t } = useTranslation();
    return (
        <div className="px-6">
            <div className="flex items-center gap-2 border border-gray-300 rounded-full p-2 w-72">
            <Search size="20" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t("home.search.placeholder")}
                className="outline-none border-none w-full"
            />
            </div>
        </div>
    );
};

export default SearchInput;
