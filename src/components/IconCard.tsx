import { makeStyles, shorthands, tokens, Card, Text } from "@fluentui/react-components";
import type { IndexItem } from "../types";

const useStyles = makeStyles({
    iconCard: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...shorthands.padding("12px"),
        height: "128px",
        cursor: "pointer",
        transitionDuration: "200ms",
        userSelect: "none",
        ":hover": {
            backgroundColor: tokens.colorNeutralBackground1Hover,
            boxShadow: tokens.shadow8,
            transform: "translateY(-2px)"
        }
    },
    iconPreview: {
        width: "48px",
        height: "48px",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
});

interface IconCardProps {
    icon: IndexItem;
    onClick: (icon: IndexItem) => void;
}

export const IconCard = ({ icon, onClick }: IconCardProps) => {
    const styles = useStyles();
    return (
        <Card className={styles.iconCard} onClick={() => onClick(icon)}>
            <div className={styles.iconPreview}>
                <img
                    src={`${import.meta.env.BASE_URL}icons/${icon.folder}/SVG/${icon.icon}`}
                    alt={icon.name}
                    style={{ width: '32px', height: '32px' }}
                    onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                />
            </div>
            <Text
                size={200}
                align="center"
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: "1.2",
                    maxHeight: "2.4em",
                    width: "100%"
                }}
            >
                {icon.name}
            </Text>
        </Card>
    );
};
