
import React, {useEffect} from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Info, Navigation, Phone, Calendar } from 'lucide-react';
import { GeoJSONFeature } from '@/types/campus';

interface FeatureInfoCardProps {
  feature: GeoJSONFeature;
  onClose: () => void;
}

const FeatureInfoCard: React.FC<FeatureInfoCardProps> = ({ feature, onClose }) => {

  // Retrieve properties from the feature
  const { properties } = feature;

  // Category color mapping
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic zone':
        return 'bg-poke-blue text-white';
      case 'dining':
        return 'bg-campus-orange text-white';
      case 'auxiliary zone':
        return 'bg-campus-purple text-white';
      case 'sports':
        return 'bg-poke-red text-white';
      case 'Administration zone':
        return 'bg-campus-brown text-white';
      case 'dorm':
        return 'bg-campus-green text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Get the color for the category badge
  const getStatusBadge = () => {
    if (feature.properties.isOpen) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Open Now</Badge>;
    }
    return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Closed</Badge>;
  };

  return (
    <Card className="w-full animate-fade-in shadow-lg border-2 overflow-hidden bg-opacity-60 backdrop-blur-sm backdrop-filter">
      <div className="fixed top-2 right-2 z-10">
        <Button className="" variant="secondary" size="sm" onClick={onClose}>×</Button>
      </div>
      {properties.image && (
        <div className="w-full h-36 overflow-hidden">
          <img
            src={properties.image}
            alt={properties.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={getCategoryColor(properties.category)}>
              {properties.category}
            </Badge>
            {properties.isOpen !== undefined && getStatusBadge()}
          </div>
        </div>
        <CardTitle className="text-xl mt-1">{properties.name}</CardTitle>
        {properties.subtitle && <CardDescription>{properties.subtitle}</CardDescription>}
      </CardHeader>

      <CardContent className="pb-3 space-y-3">
        {properties.description && (
          <p className="text-sm text-muted-foreground">{properties.description}</p>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin size={16} className="mr-1 shrink-0" />
          <span>{properties.address || 'Campus Location'}</span>
        </div>

        {properties.hours && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock size={16} className="mr-1 shrink-0" />
            <span>{properties.hours}</span>
          </div>
        )}

        {properties.phone && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone size={16} className="mr-1 shrink-0" />
            <span>{properties.phone}</span>
          </div>
        )}

        {properties.tags && properties.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {properties.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" className="w-[48%]">
          <Info size={16} className="mr-1" />
          Details
        </Button>
        <Button size="sm" className="w-[48%] bg-poke-blue hover:bg-poke-dark-blue">
          <Navigation size={16} className="mr-1" />
          Directions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureInfoCard;