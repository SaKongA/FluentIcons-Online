import { makeStyles, shorthands, Button, Text, tokens } from "@fluentui/react-components";
import { NavigationRegular, LineStyleRegular, GridRegular } from "@fluentui/react-icons";
import type { IconStyle } from "../types";
import { type Language, translations } from "../i18n";

const useStyles = makeStyles({
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...shorthands.gap("12px"),
        ...shorthands.padding("20px", "0"),
        width: "100%",
        maxWidth: "1200px",
        marginRight: "auto",
        marginLeft: "auto",
        flexWrap: "wrap",
    },
    count: {
        color: tokens.colorNeutralForeground4,
        marginLeft: "12px",
        borderLeftWidth: "1px",
        borderLeftStyle: "solid",
        borderLeftColor: tokens.colorNeutralStroke2,
        ...shorthands.padding("0", "0", "0", "12px")
    }
});

interface FiltersToolbarProps {
    selectedStyle: IconStyle;
    onStyleChange: (style: IconStyle) => void;
    iconCount: number;
    language: Language;
}

export const FiltersToolbar = ({ selectedStyle, onStyleChange, iconCount, language }: FiltersToolbarProps) => {
    const styles = useStyles();
    const t = translations[language];

    return (
        <div className={styles.toolbar}>
            <Button
                appearance={selectedStyle === "All" ? "primary" : "subtle"}
                icon={<NavigationRegular />}
                onClick={() => onStyleChange("All")}
            >
                {t.allStyles}
            </Button>
            <Button
                appearance={selectedStyle === "Regular" ? "primary" : "subtle"}
                icon={<LineStyleRegular />}
                onClick={() => onStyleChange("Regular")}
            >
                {t.regular}
            </Button>
            <Button
                appearance={selectedStyle === "Filled" ? "primary" : "subtle"}
                icon={<GridRegular />}
                onClick={() => onStyleChange("Filled")}
            >
                {t.filled}
            </Button>

            <Text size={200} className={styles.count}>
                <b>{iconCount}</b> {t.iconsFound}
            </Text>
        </div>
    );
};
