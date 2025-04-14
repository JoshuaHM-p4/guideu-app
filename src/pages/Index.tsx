
import React, { useState } from 'react';
import MapContainer from '@/components/MapContainer';
import Sidebar from '@/components/Sidebar';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const handleFeatureSelect = (feature: any) => {
    setSelectedFeature(feature);
    toast({
      title: "Location Selected",
      description: `You selected ${feature.name}`,
      duration: 2000
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Map Container */}
      <MapContainer
        onMenuToggle={toggleSidebar}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onFeatureSelect={handleFeatureSelect}
      />

      {/* Overlay when sidebar is open (mobile only) */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Index;
