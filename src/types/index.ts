export interface IndexItem {
    name: string;
    icon: string;
    metaphor: string[];
    folder: string;
}

export interface IndexData {
    Regular: IndexItem[];
    Filled: IndexItem[];
    lastUpdated?: string;
}

export interface MetadataData {
    name: string;
    size: number[];
    style: string[];
    keyword: string;
    description: string;
    metaphor: string[];
}

export type IconStyle = "All" | "Regular" | "Filled";
