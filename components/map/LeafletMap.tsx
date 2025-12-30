import React, { useEffect, useRef } from 'react';
import { MapTeam } from '../../types';

interface LeafletMapProps {
  teams: MapTeam[];
  selectedTeamId: string | null;
  onSelectTeam: (team: MapTeam) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ teams, selectedTeamId, onSelectTeam }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // L.Map
  const markersRef = useRef<Map<string, any>>(new Map()); // Map<id, L.Marker>

  // Initialize Map with Retry Logic
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initMap = () => {
        // @ts-ignore - Leaflet is loaded via CDN in index.html
        const L = window.L;
        if (!L || !mapContainerRef.current) return false;

        const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView([45.0, 65.0], 3); // Centered roughly on Eurasia/World

        // Dark Matter Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
        return true;
    };

    // Attempt to initialize immediately
    if (!initMap()) {
        // If failed (script not loaded yet), poll for it
        const intervalId = setInterval(() => {
            if (initMap()) {
                clearInterval(intervalId);
            }
        }, 100);

        // Stop trying after 5 seconds to avoid infinite loops
        setTimeout(() => clearInterval(intervalId), 5000);

        return () => clearInterval(intervalId);
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Resize
  useEffect(() => {
     const handleResize = () => {
         if (mapInstanceRef.current) {
             mapInstanceRef.current.invalidateSize();
         }
     };

     // Listen for window resize to fix gray areas
     window.addEventListener('resize', handleResize);
     
     // Initial check
     setTimeout(handleResize, 500);

     return () => {
         window.removeEventListener('resize', handleResize);
     };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    // @ts-ignore
    const L = window.L;
    if (!L) return;

    // Clear removed markers
    markersRef.current.forEach((marker, id) => {
        if (!teams.find(t => t.id === id)) {
            marker.remove();
            markersRef.current.delete(id);
        }
    });

    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div class='marker-pin'></div>",
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });
    
    const activeIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div class='marker-pin' style='background: #fff; box-shadow: 0 0 15px #fff;'></div>",
        iconSize: [36, 48],
        iconAnchor: [18, 48]
    });

    teams.forEach(team => {
        if (!team.coordinates) return;

        let marker = markersRef.current.get(team.id);
        const isSelected = team.id === selectedTeamId;

        if (!marker) {
            marker = L.marker([team.coordinates.lat, team.coordinates.lng], {
                icon: isSelected ? activeIcon : customIcon
            }).addTo(map);
            
            marker.on('click', () => {
                onSelectTeam(team);
            });
            
            markersRef.current.set(team.id, marker);
        } else {
            marker.setIcon(isSelected ? activeIcon : customIcon);
            marker.setLatLng([team.coordinates.lat, team.coordinates.lng]);
            // Bring selected marker to front
            if (isSelected) marker.setZIndexOffset(1000);
            else marker.setZIndexOffset(0);
        }
    });

  }, [teams, selectedTeamId, onSelectTeam]);

  // Fly to selected
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedTeamId) return;

    const team = teams.find(t => t.id === selectedTeamId);
    if (team && team.coordinates) {
        map.flyTo([team.coordinates.lat, team.coordinates.lng], 10, {
            duration: 1.5,
            easeLinearity: 0.25
        });
    }
  }, [selectedTeamId, teams]);

  return (
    <div ref={mapContainerRef} className="w-full h-full z-0 outline-none" />
  );
};

export default LeafletMap;