import L from 'leaflet';
import { GeoJSONFeatureCollection, CampusLocationProperties } from '@/types/campus';

// Create a Leaflet icon for different location types
export const createCustomIcon = (properties: CampusLocationProperties): L.DivIcon => {
  const getCategoryColor = () => {
    switch (properties.category.toLowerCase()) {
      case 'academic': return '#2A75BB'; // poke-blue
      case 'dining': return '#FF9800'; // campus-orange
      case 'auxiliary zone': return '#9C27B0'; // campus-purple
      case 'sports': return '#FF5350'; // poke-red
      case 'Administration zone': return '#8D6E63'; // campus-brown
      case 'dorm': return '#4CAF50'; // campus-green
      default: return '#666666';
    }
  };

  const getIconPath = () => {
    switch (properties.category.toLowerCase()) {
      case 'academic':
        return `<path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3Z" />`;
      case 'dining':
        return `<path d="M9 2a1 1 0 0 1 1 1v1h2V3a1 1 0 1 1 2 0v1h2V3a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm9 9V8H6v3a5 5 0 0 0 5 5h2a5 5 0 0 0 5-5Z" />`;
      case 'auxiliary zone':
        return `<path d="M12 21.7C11.3 21.5 10.7 21.4 10 21.2C7.5 20.5 5 19.7 3.4 18C2.6 17.1 2 16 2 14.7V6.7C2 5.8 2.4 5.1 3.1 4.7C3.4 4.5 3.7 4.4 4 4.4C4.4 4.4 4.8 4.5 5.1 4.7L5.2 4.8C5.3 4.9 5.5 4.9 5.6 5C5.8 5.1 6 5.1 6.1 5.2C6.7 5.5 7.4 5.7 8 5.8L12 6.7V21.7Z M12 6.7L16 5.8C16.6 5.7 17.3 5.5 17.9 5.2C18 5.1 18.2 5.1 18.4 5C18.5 4.9 18.7 4.9 18.8 4.8L18.9 4.7C19.2 4.5 19.6 4.4 20 4.4C20.3 4.4 20.6 4.5 20.9 4.7C21.6 5.1 22 5.8 22 6.7V14.7C22 16 21.4 17.1 20.6 18C19 19.7 16.5 20.5 14 21.2C13.3 21.4 12.7 21.5 12 21.7V6.7Z" />`;
      case 'sports':
        return `<path d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z" />`;
      case 'Administration zone':
        return `<path d="M20 6H4V9H20V6Z M21 14V12L20 7H4L3 12V14H4V20H14V14H18V20H20V14H21Z M12 18H6V14H12V18Z" />`;
      case 'dorm':
        return `<path d="M19 9.3V4h-3v2.6L12 3L2 12h3v8h5v-6h4v6h5v-8h3L19 9.3Z" />`;
      default:
        return `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />`;
    }
  };

  const color = getCategoryColor();
  const pulseColor = color + '40'; // 25% opacity version

  const html = `
  <div class="relative">
    <div class="pulse" style="background-color: ${pulseColor};"></div>
    <div class="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md border-2" style="border-color: ${color};">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        ${getIconPath()}
      </svg>
    </div>
  </div>
  `;

  return L.divIcon({
    html: html,
    className: 'location-marker',
    iconSize: [12, 12],  // Increased size
    iconAnchor: [6, 12], // Updated anchor to be center-bottom
  });
};

// Function to calculate the centroid of a MultiPolygon
export const calculateMultiPolygonCentroid = (coordinates: number[][][]): [number, number] | null => {
  let x = 0, y = 0, count = 0;

  // Loop through each polygon in the MultiPolygon
  coordinates.forEach(polygon => {
    // Each polygon is an array of rings (coordinates)
    polygon.forEach(ring => {
      // Calculate the centroid of the ring (polygon) using the average of the points
      ring.forEach(([lat, lng]) => {
        x += lat;
        y += lng;
        count += 1;
      });
    });
  });

  // Return the centroid if there were any points
  return count > 0 ? [x / count, y / count] : null;
};

// Create and add Leaflet markers for all locations
export const createLeafletMarkers = (map: L.Map, campusData: GeoJSONFeatureCollection[], onClick: (location: CampusLocationProperties) => void): L.Marker[] => {
  const markers: L.Marker[] = [];

  // Ensure campusData has features
  if (!campusData || !campusData.features || !Array.isArray(campusData.features)) {
    console.error("Invalid campusData: features array is missing or malformed.");
    return markers;
  }

  campusData.features.forEach((feature) => {
    const { geometry, properties } = feature;

    if (!geometry || !properties) {
      console.warn("Feature is missing geometry or properties:", feature);
      return;
    }

    // Handle Point geometry (standard for location markers)
    if (geometry.type === 'Point') {
      const [lat, lng] = geometry.coordinates;

      const marker = L.marker([lat, lng], {
        icon: createCustomIcon(properties),
        riseOnHover: true,
      }).addTo(map);

      // Add click handler
      marker.on('click', () => {
        // Fly to the marker
        map.flyTo([lng, lat], 18.5, {
          duration: 0.5,
        });

        onClick(feature);  // Pass feature (the building )
      });

      markers.push(marker);
    }


    // Handle MultiPolygon geometry
    else if (geometry.type === 'MultiPolygon') {
      // Calculate the centroid of the MultiPolygon
      const centroid = calculateMultiPolygonCentroid(geometry.coordinates);

      if (centroid) {
        const [lng, lat] = centroid;

        const marker = L.marker([lat, lng], {
          icon: createCustomIcon(properties), // Assuming this function uses properties
          riseOnHover: true,
        }).addTo(map);

        // Add click handler
        marker.on('click', () => {
          // Fly to the marker
          map.flyTo([lat, lng], 18.5, {
            duration: 0.5,
          });

          onClick(feature);  // Pass feature (the building)
        });

        markers.push(marker);
      }
    }
  });

  return markers;
};


