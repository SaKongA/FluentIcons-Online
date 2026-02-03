import { makeStyles, shorthands, tokens, Title1, Subtitle1, Input, Button } from "@fluentui/react-components";
import { SearchRegular, LocalLanguage24Regular } from "@fluentui/react-icons";
import { type Language, translations } from "../i18n";

const useStyles = makeStyles({
    header: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...shorthands.padding("40px", "20px"),
        background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackground2} 100%)`,
        color: tokens.colorNeutralForegroundOnBrand,
        position: "relative"
    },
    langSwitch: {
        position: "absolute",
        top: "20px",
        right: "20px",
    },
    searchWrapper: {
        width: "100%",
        maxWidth: "600px",
        display: "flex",
        ...shorthands.gap("12px"),
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusMedium,
        ...shorthands.padding("4px"),
        marginTop: "20px",
        boxShadow: tokens.shadow16
    }
});

interface HeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    language: Language;
    onLanguageChange: (lang: Language) => void;
}

export const Header = ({ searchTerm, onSearchChange, language, onLanguageChange }: HeaderProps) => {
    const styles = useStyles();
    const t = translations[language];

    return (
        <header className={styles.header}>
            <div className={styles.langSwitch}>
                <Button
                    appearance="transparent"
                    style={{ color: 'white' }}
                    icon={<LocalLanguage24Regular />}
                    onClick={() => onLanguageChange(language === 'en' ? 'zh' : 'en')}
                >
                    {language === 'en' ? '中文' : 'English'}
                </Button>
            </div>

            <Title1>{t.title}</Title1>
            <Subtitle1 style={{ opacity: 0.8 }}>{t.subtitle}</Subtitle1>
            <div className={styles.searchWrapper}>
                <Input
                    value={searchTerm}
                    onChange={(_, data) => onSearchChange(data.value)}
                    placeholder={t.searchPlaceholder}
                    contentBefore={<SearchRegular />}
                    size="large"
                    style={{ flexGrow: 1 }}
                />
            </div>
        </header>
    );
};
