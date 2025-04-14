// components/GeoJsonLayer.tsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L, { Layer } from 'leaflet';

interface GeoJsonLayerProps {
  data: GeoJSON.GeoJsonObject | Record<string, any>;  //;
  style?: L.PathOptions;
  pointToLayer?: (feature: any, latlng: L.LatLng) => Layer;
  onEachFeature?: (feature: any, layer: L.Layer) => void;
}

const GeoJsonLayer = ({ data, style, pointToLayer, onEachFeature }: GeoJsonLayerProps) => {
  const map = useMap();

  useEffect(() => {
    const geoJsonLayer = L.geoJSON(data, {
      style,
      pointToLayer,
      onEachFeature
    });

    geoJsonLayer.addTo(map);

    return () => {
      map.removeLayer(geoJsonLayer);
    };
  }, [data, map, style, pointToLayer, onEachFeature]);

  return null;
};

export default GeoJsonLayer;