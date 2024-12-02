import { GoogleMap, Marker } from '@react-google-maps/api'
import { useCallback, useMemo, useRef, useState } from 'react';

const Map = () => {
    const [selectedLocations, setSelectedLocations] = useState<google.maps.LatLngLiteral[]>([]);
    const mapRef = useRef<google.maps.Map>();
    const mapStyles = {
        height: '100vh',
        width: '100%'
    }
    const mapCenter = useMemo<google.maps.LatLngLiteral>(() => ({lat: 26.1158,lng: 91.7086}), []);

    const options = useMemo<google.maps.MapOptions>(() => ({ disableDefaultUI: true, zoomControl: true }), []);

    const onload = useCallback((map: google.maps.Map) => { mapRef.current = map; }, []);

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const latLng = event.latLng?.toJSON();
        if (latLng) {
            setSelectedLocations(prev => [...prev, latLng]);
        }
    }
    const handleMarkerClick = (position: google.maps.LatLngLiteral) => {
        const filteredLocations = selectedLocations.filter(loc => loc.lat !== position.lat && loc.lng !== position.lng);
        setSelectedLocations(filteredLocations);
    }
    const handleClearClick = () => {
        setSelectedLocations([]);
    }
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={mapCenter}
                options={options}
                onLoad={onload}
                onClick={handleMapClick}
            >
                {selectedLocations.map((position, index) => (
                    <Marker key={`${position.lat}-${position.lng}-${index}`} position={position} onClick={() => handleMarkerClick(position)} />
                ))}
                {selectedLocations.length > 0 && <button onClick={handleClearClick}>Clear</button>}
            </GoogleMap>
        </div>
    )
}

export default Map
