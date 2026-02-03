import { useState, useEffect } from 'react';
import {
    makeStyles, shorthands, Drawer, DrawerHeader, DrawerHeaderTitle,
    DrawerBody, Button, Title1, Text, Divider, Badge, tokens
} from "@fluentui/react-components";
import { DismissRegular, ArrowDownloadRegular } from "@fluentui/react-icons";
import type { IndexItem, MetadataData } from "../types";
import { type Language, translations } from "../i18n";

const useStyles = makeStyles({
    detailSection: {
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        ...shorthands.gap("16px"),
        ...shorthands.padding("0", "0", "40px", "0")
    },
    drawerBody: {
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
            display: "none"
        }
    },
    previewContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...shorthands.padding("32px"),
        backgroundColor: tokens.colorNeutralBackground3,
        borderRadius: tokens.borderRadiusLarge,
        ...shorthands.margin("8px", "0"),
        minHeight: "160px",
        ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1)
    },
    largePreview: {
        width: "96px",
        height: "96px",
        color: tokens.colorNeutralForeground1,
        transitionDuration: "200ms"
    },
    selectorGroup: {
        display: "flex",
        flexDirection: "column",
        ...shorthands.gap("8px")
    },
    tagList: {
        display: "flex",
        flexWrap: "wrap",
        ...shorthands.gap("8px")
    },
    activeBadge: {
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
        cursor: "default",
        ":hover": {
            backgroundColor: tokens.colorBrandBackground
        }
    },
    selectableBadge: {
        cursor: "pointer",
        ":hover": {
            backgroundColor: tokens.colorNeutralBackground1Hover
        }
    },
    downloadActions: {
        display: "flex",
        flexDirection: "column",
        ...shorthands.gap("12px"),
        marginTop: "12px"
    },
    actionRow: {
        display: "flex",
        ...shorthands.gap("8px"),
        width: "100%"
    },
    fullWidth: {
        flexGrow: 1
    }
});

interface IconDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedIcon: IndexItem | null;
    metadata: MetadataData | null;
    language: Language;
}

export const IconDrawer = ({ isOpen, onOpenChange, selectedIcon, metadata, language }: IconDrawerProps) => {
    const styles = useStyles();
    const t = translations[language];
    const [currentSize, setCurrentSize] = useState<number>(24);
    const [currentStyle, setCurrentStyle] = useState<string>("Regular");

    useEffect(() => {
        if (metadata) {
            if (metadata.size?.length > 0) setCurrentSize(metadata.size[0]);
            if (metadata.style?.length > 0) setCurrentStyle(metadata.style[0]);
        }
    }, [metadata]);

    const getFilePath = (size: number, style: string, ext: 'svg' | 'pdf') => {
        if (!selectedIcon) return "";
        const dir = ext.toUpperCase();
        const fileName = `ic_fluent_${selectedIcon.name.toLowerCase().replace(/ /g, "_")}_${size}_${style.toLowerCase()}.${ext}`;
        return `/icons/${selectedIcon.folder}/${dir}/${fileName}`;
    };

    const downloadFile = (ext: 'svg' | 'pdf') => {
        if (!selectedIcon) return;
        const path = getFilePath(currentSize, currentStyle, ext);
        const fileName = `ic_fluent_${selectedIcon.name.toLowerCase().replace(/ /g, "_")}_${currentSize}_${currentStyle.toLowerCase()}.${ext}`;
        const link = document.createElement('a');
        link.href = path;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPNG = () => {
        if (!selectedIcon) return;
        const svgPath = getFilePath(currentSize, currentStyle, 'svg');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = svgPath;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = 4;
            canvas.width = currentSize * scale;
            canvas.height = currentSize * scale;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const pngUrl = canvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.href = pngUrl;
                link.download = `ic_fluent_${selectedIcon.name.toLowerCase().replace(/ /g, "_")}_${currentSize}_${currentStyle.toLowerCase()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };
    };

    return (
        <Drawer
            position="end"
            open={isOpen}
            onOpenChange={(_, { open }) => onOpenChange(open)}
            style={{ width: '420px' }}
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={<Button appearance="subtle" icon={<DismissRegular />} onClick={() => onOpenChange(false)} />}
                >
                    {t.iconDetails}
                </DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody className={styles.drawerBody}>
                {selectedIcon && (
                    <div className={styles.detailSection}>
                        <Title1>{selectedIcon.name}</Title1>

                        <div className={styles.previewContainer}>
                            <img
                                src={getFilePath(currentSize, currentStyle, 'svg')}
                                alt={selectedIcon.name}
                                className={styles.largePreview}
                                onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                            />
                            <Text size={200} weight="semibold" style={{ marginTop: '12px', opacity: 0.8 }}>
                                {currentSize}px / {currentStyle}
                            </Text>
                        </div>

                        {metadata ? (
                            <>
                                <Text>{metadata.description}</Text>
                                <Divider />

                                <div className={styles.selectorGroup}>
                                    <Text weight="semibold">{t.selectPreviewSize}</Text>
                                    <div className={styles.tagList}>
                                        {metadata.size.map(s => (
                                            <Badge
                                                key={s}
                                                color="subtle"
                                                shape="rounded"
                                                size="large"
                                                className={currentSize === s ? styles.activeBadge : styles.selectableBadge}
                                                onClick={() => setCurrentSize(s)}
                                            >
                                                {s}px
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.selectorGroup}>
                                    <Text weight="semibold">{t.attributes}</Text>
                                    <div className={styles.tagList}>
                                        {metadata.style.map(st => (
                                            <Badge
                                                key={st}
                                                color="subtle"
                                                shape="rounded"
                                                size="large"
                                                className={currentStyle === st ? styles.activeBadge : styles.selectableBadge}
                                                onClick={() => setCurrentStyle(st)}
                                            >
                                                {st}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Divider />

                                <div className={styles.selectorGroup}>
                                    <Text weight="semibold">{t.downloadAssets}</Text>
                                    <div className={styles.downloadActions}>
                                        <Button
                                            appearance="primary"
                                            size="large"
                                            icon={<ArrowDownloadRegular />}
                                            onClick={() => downloadFile('svg')}
                                        >
                                            {t.downloadSvg}
                                        </Button>
                                        <div className={styles.actionRow}>
                                            <Button
                                                className={styles.fullWidth}
                                                size="large"
                                                icon={<ArrowDownloadRegular />}
                                                onClick={downloadPNG}
                                            >
                                                {t.downloadPng}
                                            </Button>
                                            <Button
                                                className={styles.fullWidth}
                                                size="large"
                                                icon={<ArrowDownloadRegular />}
                                                onClick={() => downloadFile('pdf')}
                                            >
                                                {t.downloadPdf}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <Divider />

                                <div className={styles.selectorGroup}>
                                    <Text weight="semibold">{t.attributes}</Text>
                                    <Text size={200}><b>{t.keywords}:</b> {metadata.keyword}</Text>
                                    <Text size={200}><b>{t.metaphors}:</b> {metadata.metaphor.join(", ")}</Text>
                                </div>
                            </>
                        ) : (
                            <Text>{t.loadingMetadata}</Text>
                        )}
                    </div>
                )}
            </DrawerBody>
        </Drawer>
    );
};
