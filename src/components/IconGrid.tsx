import { useState, useMemo, useRef, useEffect } from 'react';
import { makeStyles, shorthands, Button, Text } from "@fluentui/react-components";
import { ChevronLeftRegular, ChevronRightRegular } from "@fluentui/react-icons";
import type { IndexItem } from "../types";
import { IconCard } from "./IconCard";
import { type Language, translations } from "../i18n";

const useStyles = makeStyles({
    contentArea: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        ...shorthands.gap("24px")
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
        ...shorthands.gap("16px"),
        width: "100%"
    },
    paginationWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...shorthands.gap("16px"),
        marginTop: "auto",
        ...shorthands.padding("16px", "0")
    }
});

interface IconGridProps {
    icons: IndexItem[];
    onIconClick: (icon: IndexItem) => void;
    language: Language;
}

export const IconGrid = ({ icons, onIconClick, language }: IconGridProps) => {
    const styles = useStyles();
    const t = translations[language];
    const [currentPage, setCurrentPage] = useState(1);
    const [columns, setColumns] = useState(0);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [icons]);

    useEffect(() => {
        if (!gridRef.current) return;

        const updateColumns = () => {
            if (gridRef.current) {
                const width = gridRef.current.offsetWidth;
                const itemWidth = 130;
                const gap = 16;
                const cols = Math.floor((width + gap) / (itemWidth + gap));
                setColumns(cols || 1);
            }
        };

        const observer = new ResizeObserver(updateColumns);
        observer.observe(gridRef.current);
        updateColumns();

        return () => observer.disconnect();
    }, []);

    const itemsPerPage = useMemo(() => columns * 6, [columns]);
    const totalPages = Math.max(1, Math.ceil(icons.length / itemsPerPage));

    const pagedIcons = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return icons.slice(start, start + itemsPerPage);
    }, [icons, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <main className={styles.contentArea}>
            <div ref={gridRef} className={styles.grid}>
                {pagedIcons.map(icon => (
                    <IconCard
                        key={`${icon.name}-${icon.icon}`}
                        icon={icon}
                        onClick={onIconClick}
                    />
                ))}
            </div>

            {icons.length > 0 && (
                <div className={styles.paginationWrapper}>
                    <Button
                        icon={<ChevronLeftRegular />}
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        {t.previous}
                    </Button>
                    <Text>{t.page} {currentPage} {t.of} {totalPages}</Text>
                    <Button
                        icon={<ChevronRightRegular />}
                        iconPosition="after"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        {t.next}
                    </Button>
                </div>
            )}
        </main>
    );
};
