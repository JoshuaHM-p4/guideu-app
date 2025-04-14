
import React, { useState, useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer, ZoomControl, useMap, ImageOverlay, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Menu } from 'lucide-react';
import { useCampusData } from '@/hooks/useCampusData';
import { createLeafletMarkers, calculateMultiPolygonCentroid } from '@/utils/mapUtils';
import LocationInfoCard from '@/components/LocationInfoCard';
import GeoJsonLayer from '@/components/GeoJsonLayer';

import pathData from '@/data/pathData.json';
import buildings from '@/data/buildings.json';



// Fix Leaflet default icon issue
import L from 'leaflet';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const onEachFeature = (feature: any, layer: L.Layer) => {
  const props = feature.properties;
  const content = Object.entries(props)
    .map(([key, val]) => `<tr><td><strong>${key}</strong></td><td>${val}</td></tr>`)
    .join('');
  layer.bindPopup(`<table>${content}</table>`);
};

// Component to handle map interactions after the map is rendered
const MapController = ({
  onMapReady
}: {
  onMapReady: (map: L.Map) => void;
}) => {
  const map = useMap();

  // Call the callback with the map instance
  React.useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  return null;
};

const MapContainer = ({ onMenuToggle }: { onMenuToggle: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const { campusData, isLoading, error } = useCampusData();
  const [leafletMap, setLeafletMap] = useState<L.Map | null>(null);

  // Default coordinates (Marinduque State University)
  const defaultCenter: [number, number] = [13.45424674, 121.8445970];
  const defaultZoom = 16.5;

  // Handle search functionality
  const handleSearch = () => {
    if (!searchQuery.trim() || !leafletMap || !campusData || !campusData.features) return;

    const lowercaseQuery = searchQuery.toLowerCase();

    // Loop through the features array and search within the properties
    const matchedFeature = campusData.features.find(
      feature =>
        feature.properties.name.toLowerCase().includes(lowercaseQuery) ||
        feature.properties.category.toLowerCase().includes(lowercaseQuery) ||
        (feature.properties.tags &&
          feature.properties.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );

    if (matchedFeature) {
      let coordinates: [number, number] | null = null;

      // Check if the feature's geometry is of type 'Point'
      if (matchedFeature.geometry.type === 'Point' && matchedFeature.geometry.coordinates) {
        // For Point geometry, coordinates are directly usable
        const [lng, lat] = matchedFeature.geometry.coordinates;
        coordinates = [lat, lng];
      } else if (matchedFeature.geometry.type === 'MultiPolygon' && matchedFeature.geometry.coordinates) {
        // For MultiPolygon geometry, calculate the centroid using the utility function
        coordinates = calculateMultiPolygonCentroid(matchedFeature.geometry.coordinates);
      }

      if (coordinates) {
        const [lng, lat] = coordinates;
        console.log(coordinates);

        leafletMap.flyTo([lat, lng], 20, {
          duration: 1,
          animate: true
        });

        // Highlight and select the location (set selectedFeature with the matched feature)
        setSelectedFeature(matchedFeature);
      }
    }
  };

  // Handle when the map is ready
  const handleMapReady = (map: L.Map) => {
    setLeafletMap(map);

    // Create markers when map and data are ready
    if (campusData && campusData.features && campusData.features.length > 0) {
      createLeafletMarkers(map, campusData, (feature) => {
        setSelectedFeature(feature);
      });
    }
  };

  const imageBounds: [[number, number], [number, number]] = [
    [13.452328543763361, 121.84308169222885], // Southwest corner
    [13.455938316951604, 121.84619810381888]  // Northeast corner
  ];

  return (
    <div className="relative w-full h-screen z-0">
      {/* Leaflet Map Container */}
      <div className="absolute inset-0">
        <LeafletMap
          center={defaultCenter}
          zoom={defaultZoom}
          maxZoom={30}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ImageOverlay
            url="/images/GuideMarSUMap_1.png"
            bounds={imageBounds}
            opacity={0.9}
          />
          <ZoomControl position="bottomright" />
          <MapController onMapReady={handleMapReady} />
          {campusData && (
            <>
              <GeoJsonLayer
                data={pathData}
                style={{ color: 'rgba(243,166,178,1.0)', weight: 5, opacity: 1 }}
                onEachFeature={onEachFeature}
              />
              <GeoJsonLayer
                data={buildings}
                style={{
                  color: 'rgba(35,35,35,1.0)',
                  fillColor: 'rgba(62,37,199,1.0)',
                  fillOpacity: 1,
                  weight: 1,
                }}
                onEachFeature={onEachFeature}
              />
            </>
          )}
        </LeafletMap>
      </div>

      {/* Top Navigation */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-2 z-[1000]">
        <Button
          variant="secondary"
          size="icon"
          className="bg-white shadow-md hover:bg-gray-100"
          onClick={onMenuToggle}
        >
          <Menu size={20} />
        </Button>

        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search for buildings, facilities..."
            className="pr-10 h-10 bg-white shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-10"
            onClick={handleSearch}
          >
            <Search size={18} />
          </Button>
        </div>
      </div>

      {/* Location Info Card */}
      {selectedFeature && (
        <div className="absolute bottom-6 right-1/3 transform translate-x-full w-full max-w-sm px-4 z-[1000]">
          <LocationInfoCard
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        </div>
      )}

      {/* Current Position Button */}
      <div className="absolute bottom-24 right-4 z-[1000]">
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={() => leafletMap?.locate({ setView: true, maxZoom: 30 })}
        >
          <MapPin size={20} className="text-poke-blue" />
        </Button>
      </div>

      {/* Loading or Error Messages */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-[1000]">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>Loading campus data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-destructive text-destructive-foreground p-3 rounded-lg shadow-lg">
            <p>Error loading campus data. Please try again.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
