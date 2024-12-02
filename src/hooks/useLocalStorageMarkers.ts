import { useState, useEffect } from 'react';

type Marker = {
    position: google.maps.LatLngLiteral;
    name: string;
};

export const useLocalStorageMarkers = () => {
    const [markers, setMarkers] = useState<Marker[]>(() => {
        const savedMarkers = localStorage.getItem('mapMarkers');
        return savedMarkers ? JSON.parse(savedMarkers) : [];
    });

    useEffect(() => {
        localStorage.setItem('mapMarkers', JSON.stringify(markers));
    }, [markers]);

    const addMarker = (newMarker: Marker) => {
        setMarkers(prev => [...prev, newMarker]);
    };

    const removeMarker = (position: google.maps.LatLngLiteral) => {
        setMarkers(prev => 
            prev.filter(marker => 
                marker.position.lat !== position.lat || 
                marker.position.lng !== position.lng
            )
        );
    };

    return { markers, addMarker, removeMarker };
}; 