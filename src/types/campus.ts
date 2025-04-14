export interface GeoJSONFeatureCollection {
    type: "FeatureCollection";
    features: GeoJSONFeature[];
}
export interface GeoJSONFeature {
    type: "Feature";
    geometry: {
        type: "MultiPolygon";
        coordinates: [number, number];
    };
    properties: CampusLocationProperties;
}
export interface CampusLocationProperties {
    id?: string | number;
    name: string;
    category: string;
    logo?: string;
    image?: string;
    description?: string;
    dean?: string;
    hours?: string;
    address?: string;
    contact?: string;
    website?: string;
    isOpen?: boolean;
    tags?: string[];
    facilities?: string[];
}