// src/components/FreeHealthcareMap.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Stethoscope, Pill } from 'lucide-react';

// Fix for default markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

interface HealthcareFacility {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'clinic';
  lat: number;
  lng: number;
  address: string;
  distance?: string;
}

const FreeHealthcareMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([28.6139, 77.2090]); // Default: Delhi
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Custom icons for different facility types
  const hospitalIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const pharmacyIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          searchNearbyFacilities(location[0], location[1]);
        },
        (error) => {
          console.error('Geolocation error:', error);
          searchNearbyFacilities(userLocation[0], userLocation[1]);
        }
      );
    } else {
      searchNearbyFacilities(userLocation[0], userLocation[1]);
    }
  };

  // Using Overpass API (OpenStreetMap) to find healthcare facilities
  const searchNearbyFacilities = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      // Overpass API query for hospitals and pharmacies within 3km
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:3000,${lat},${lng});
          node["amenity"="pharmacy"](around:3000,${lat},${lng});
          node["amenity"="clinic"](around:3000,${lat},${lng});
        );
        out geom;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      
      const healthcareFacilities: HealthcareFacility[] = data.elements
        .filter((element: any) => element.tags && (element.tags.name || element.tags['name:en']))
        .map((element: any) => ({
          id: element.id.toString(),
          name: element.tags.name || element.tags['name:en'] || 'Healthcare Facility',
          type: element.tags.amenity === 'pharmacy' ? 'pharmacy' : 
                element.tags.amenity === 'clinic' ? 'clinic' : 'hospital',
          lat: element.lat,
          lng: element.lon,
          address: element.tags['addr:full'] || 
                  `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street'] || ''}`.trim() ||
                  'Address not available',
          distance: calculateDistance(lat, lng, element.lat, element.lon)
        }))
        .slice(0, 15); // Limit to 15 results

      setFacilities(healthcareFacilities);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      // Fallback data in case of API failure
      setFacilities([
        {
          id: 'fallback-1',
          name: 'Sample Hospital',
          type: 'hospital',
          lat: lat + 0.01,
          lng: lng + 0.01,
          address: 'Sample address',
          distance: '1.2 km'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return `${distance.toFixed(1)} km`;
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return <Stethoscope className="w-4 h-4 text-red-500" />;
      case 'pharmacy':
        return <Pill className="w-4 h-4 text-blue-500" />;
      default:
        return <MapPin className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <section className="py-16" style={{ backgroundColor: '#FDFCF8' }}>
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
            Find Nearby Healthcare
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: '#6B6B6B' }}>
            Locate hospitals, clinics, and pharmacies in your area using free OpenStreetMap data — 
            no API keys required, completely free to use.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={getCurrentLocation}
            className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#1A1A1A', color: 'white' }}
          >
            <Navigation className="w-4 h-4" />
            Find Healthcare Near Me
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="p-4 border-2 shadow-sm" style={{ backgroundColor: 'white', borderColor: '#E5E5E5' }}>
              <MapContainer 
                center={userLocation} 
                zoom={13} 
                style={{ height: '400px', width: '100%', borderRadius: '12px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* User location marker */}
                <Marker position={userLocation}>
                  <Popup>
                    <div className="text-center">
                      <strong>📍 Your Location</strong>
                      <br />
                      <small>Healthcare facilities around you</small>
                    </div>
                  </Popup>
                </Marker>

                {/* Healthcare facilities */}
                {facilities.map((facility) => (
                  <Marker
                    key={facility.id}
                    position={[facility.lat, facility.lng]}
                    icon={facility.type === 'pharmacy' ? pharmacyIcon : hospitalIcon}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h4 className="font-bold mb-2">{facility.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">{facility.address}</p>
                        <div className="flex items-center gap-2 mb-1">
                          {getFacilityIcon(facility.type)}
                          <span className="text-sm capitalize">{facility.type}</span>
                        </div>
                        <p className="text-sm font-medium text-green-600">{facility.distance}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Card>
          </div>

          {/* Facilities List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold" style={{ color: '#1A1A1A' }}>
              Nearby Facilities ({facilities.length})
            </h3>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#1A1A1A' }}></div>
                <p className="mt-2" style={{ color: '#6B6B6B' }}>Finding healthcare facilities...</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-3">
                {facilities.map((facility) => (
                  <Card
                    key={facility.id}
                    className="p-4 border-2 hover:shadow-md transition-all cursor-pointer"
                    style={{ backgroundColor: 'white', borderColor: '#E5E5E5' }}
                  >
                    <div className="flex items-start gap-3">
                      {getFacilityIcon(facility.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>
                          {facility.name}
                        </h4>
                        <p className="text-xs mb-2" style={{ color: '#6B6B6B' }}>
                          {facility.address}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs capitalize px-2 py-1 rounded text-white" 
                                style={{ backgroundColor: facility.type === 'pharmacy' ? '#3B82F6' : '#EF4444' }}>
                            {facility.type}
                          </span>
                          <span className="text-xs font-medium" style={{ color: '#059669' }}>
                            {facility.distance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {facilities.length === 0 && !isLoading && (
                  <div className="text-center py-4" style={{ color: '#6B6B6B' }}>
                    <p>No healthcare facilities found in this area.</p>
                    <p className="text-sm mt-2">Try clicking "Find Healthcare Near Me" to search your location.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center border-2" style={{ backgroundColor: 'white', borderColor: '#E5E5E5' }}>
            <MapPin className="w-8 h-8 mx-auto mb-4" style={{ color: '#10B981' }} />
            <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>100% Free</h4>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>No API keys, usage limits, or billing required</p>
          </Card>
          
          <Card className="p-6 text-center border-2" style={{ backgroundColor: 'white', borderColor: '#E5E5E5' }}>
            <Stethoscope className="w-8 h-8 mx-auto mb-4" style={{ color: '#3B82F6' }} />
            <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>Real Healthcare Data</h4>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>Hospitals, clinics, and pharmacies from OpenStreetMap</p>
          </Card>
          
          <Card className="p-6 text-center border-2" style={{ backgroundColor: 'white', borderColor: '#E5E5E5' }}>
            <Navigation className="w-8 h-8 mx-auto mb-4" style={{ color: '#8B5CF6' }} />
            <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>Location-Based</h4>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>Automatic location detection with distance calculation</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FreeHealthcareMap;
