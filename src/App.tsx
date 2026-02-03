import { useState, useMemo, useEffect } from 'react';
import {
  FluentProvider,
  webLightTheme,
  makeStyles,
  shorthands,
  tokens
} from "@fluentui/react-components";

import iconsDataRaw from './data/icons-index.json';
import type { IndexItem, IndexData, MetadataData, IconStyle } from './types';
import type { Language } from './i18n';
import { Header } from './components/Header';
import { FiltersToolbar } from './components/FiltersToolbar';
import { IconGrid } from './components/IconGrid';
import { IconDrawer } from './components/IconDrawer';
import { Footer } from './components/Footer';

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground2
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    width: "100%",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto",
    ...shorthands.padding("0", "24px", "40px", "24px"),
    ...shorthands.gap("0"),
  }
});

export default function App() {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>("Regular");
  const [selectedIcon, setSelectedIcon] = useState<IndexItem | null>(null);
  const [metadata, setMetadata] = useState<MetadataData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Initialize language from localStorage or browser preference
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language') as Language;
    if (saved === 'en' || saved === 'zh') return saved;
    return navigator.language.startsWith('zh') ? 'zh' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const indexData = iconsDataRaw as unknown as IndexData;

  const filteredIcons = useMemo(() => {
    let baseList: IndexItem[] = [];
    if (selectedStyle === "All") {
      const regularNames = new Set(indexData.Regular.map(i => i.name));
      baseList = [...indexData.Regular, ...indexData.Filled.filter(i => !regularNames.has(i.name))];
    } else {
      baseList = indexData[selectedStyle];
    }

    return baseList.filter(icon => {
      const term = searchTerm.toLowerCase();
      return (icon.name?.toLowerCase() || "").includes(term) ||
        (icon.metaphor || []).some(m => (m?.toLowerCase() || "").includes(term));
    });
  }, [searchTerm, selectedStyle, indexData]);

  const handleIconClick = async (icon: IndexItem) => {
    setSelectedIcon(icon);
    setMetadata(null);
    setIsDrawerOpen(true);

    try {
      const response = await fetch(`/icons/${icon.folder}/metadata.json`);
      if (response.ok) {
        const data = await response.json();
        setMetadata(data);
      }
    } catch (e) {
      console.error("Failed to load metadata", e);
    }
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.root}>
        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          language={language}
          onLanguageChange={setLanguage}
        />

        <div className={styles.mainContent}>
          <FiltersToolbar
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
            iconCount={filteredIcons.length}
            language={language}
          />

          <IconGrid
            icons={filteredIcons}
            onIconClick={handleIconClick}
            language={language}
          />
        </div>

        <IconDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          selectedIcon={selectedIcon}
          metadata={metadata}
          language={language}
        />
        <Footer language={language} lastSync={indexData.lastUpdated} />
      </div>
    </FluentProvider>
  );
}
