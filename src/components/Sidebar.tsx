
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Search, X, MapPin, School, Coffee, Book, Users, Briefcase, Home } from 'lucide-react';
import { useCampusData } from '@/hooks/useCampusData';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFeatureSelect: (feature: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onFeatureSelect }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  const { campusData } = useCampusData();

  const filteredLocations = React.useMemo(() => {
    if (!campusData || !campusData.features) return [];

    return campusData.features.filter(feature => {
      const { name, tags, category } = feature.properties;

      const matchesSearch = !searchQuery ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tags && tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));

      const matchesFilter = !activeFilter || category.toLowerCase() === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [campusData, searchQuery, activeFilter]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic zone': return <School size={18} />;
      case 'dining': return <Coffee size={18} />;
      case 'auxiliary zone': return <Book size={18} />;
      case 'sports zone': return <Users size={18} />;
      case 'administration zone': return <Briefcase size={18} />;
      case 'dorm': return <Home size={18} />;
      default: return <MapPin size={18} />;
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(prev => prev === filter.toLowerCase() ? null : filter.toLowerCase());
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b">
          <h2 className="text-xl font-bold flex items-center">
            <img src="/placeholder.svg" alt="Logo" className="h-8 w-8 mr-2" />
            Campus PokeFind
          </h2>
          <Button variant="secondary" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <h3 className="text-md font-bold flex items-center w-full px-4 mt-2">Where do you want to go?</h3>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-2">
          <p className="text-sm font-medium mb-2">Filter by type:</p>
          <div className="flex flex-wrap gap-2">
            {['Academic Zone', 'Dining', 'Auxiliary Zone', 'Sports', 'Administration Zone', 'Dorm'].map((filter) => (
              <Badge
                key={filter}
                variant={activeFilter === filter.toLowerCase() ? 'default' : 'outline'}
                className={`cursor-pointer ${activeFilter === filter.toLowerCase() ? 'bg-poke-blue' : ''}`}
                onClick={() => handleFilterClick(filter)}
              >
                {activeFilter === filter.toLowerCase() && <Check size={12} className="mr-1" />}
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Location List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredLocations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <MapPin size={24} className="mb-2" />
              <p>No locations found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredLocations.map((feature, idx) => {
                const { name, category, isOpen } = feature.properties;
                return (
                  <div
                    key={idx}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => {
                      onFeatureSelect(feature);
                      onClose();
                    }}
                  >
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3 text-primary shrink-0">
                        {getCategoryIcon(category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{category}</p>
                      </div>
                      {isOpen !== undefined && (
                        <Badge
                          variant="outline"
                          className={isOpen
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-red-100 text-red-800 border-red-300"
                          }
                        >
                          {isOpen ? "Open" : "Closed"}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Campus PokeFind v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;