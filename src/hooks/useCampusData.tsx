
import { useQuery } from '@tanstack/react-query';
import { CampusLocation } from '@/types/campus';
import { mockCampusData } from '@/data/mockCampusData';
import campusData from '@/data/campusData.json';

// Create a fetchCampusData function that simulates an API call
const fetchCampusData = async (): Promise<CampusLocation[]> => {
  // For demo, use mock data with a small delay to simulate network
  await new Promise(resolve => setTimeout(resolve, 800));
  return campusData as CampusLocation[]; // Replace with actual API call if needed
};

export const useCampusData = () => {
  // Use react-query's useQuery hook with proper configuration
  const {
    data: campusData = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['campusData'],
    queryFn: fetchCampusData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { campusData, isLoading, error };
};
