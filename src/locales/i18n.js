import { createI18n } from 'vue-i18n';
import en from "./en.json";
import ptBR from "./ptBR.json"

const i18n = createI18n({
    locale: "en",
    messages: {
        en,
        "pt-BR": ptBR,
    }
});

export default i18n;