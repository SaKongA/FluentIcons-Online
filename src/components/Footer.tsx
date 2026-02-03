import { makeStyles, shorthands, tokens, Text, Link } from "@fluentui/react-components";
import { type Language, translations } from "../i18n";

const useStyles = makeStyles({
    footer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...shorthands.padding("40px", "20px"),
        ...shorthands.gap("12px"),
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderTop("1px", "solid", tokens.colorNeutralStroke2),
        marginTop: "auto"
    },
    links: {
        display: "flex",
        ...shorthands.gap("24px"),
        flexWrap: "wrap",
        justifyContent: "center"
    },
    copyright: {
        color: tokens.colorNeutralForeground4,
        textAlign: "center"
    }
});

interface FooterProps {
    language: Language;
    lastSync?: string;
}

export const Footer = ({ language, lastSync }: FooterProps) => {
    const styles = useStyles();
    const t = translations[language];

    return (
        <footer className={styles.footer}>
            <div className={styles.links}>
                <Link href="https://github.com/SaKongA/FluentIcons-Online" target="_blank" rel="noopener noreferrer">
                    GitHub Repo
                </Link>
                <Link href="https://github.com/microsoft/fluentui-system-icons" target="_blank" rel="noopener noreferrer">
                    Microsoft Fluent Icons
                </Link>
            </div>
            <div className={styles.copyright}>
                <Text size={200}>
                    {t.footerCredit.split(/(Fluent UI|GitHub Pages)/).map((part, i) =>
                        (part === "Fluent UI" || part === "GitHub Pages") ? <b key={i}>{part}</b> : part
                    )}
                </Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
                <Text size={100}>
                    © {new Date().getFullYear()} Fluent Icons Online
                </Text>
                {lastSync && (
                    <Text size={100}>
                        {t.lastSync}: {lastSync}
                    </Text>
                )}
            </div>
        </footer>
    );
};
