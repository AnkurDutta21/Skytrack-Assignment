import { GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api'
import { useMemo, useState } from 'react';
import ViewMarkers from './ViewMarkers';
import LocationModal from '../components/LocationModal';
import { useLocalStorageMarkers } from '../hooks/useLocalStorageMarkers';

const Map = () => {
    const { markers: selectedLocations, addMarker, removeMarker } = useLocalStorageMarkers();
    const [hoveredMarker, setHoveredMarker] = useState<google.maps.LatLngLiteral | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<google.maps.LatLngLiteral | null>(null);
    const [modalPosition, setModalPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const mapStyles = {
        height: '100vh',
        width: '100%'
    }
    const mapCenter = useMemo<google.maps.LatLngLiteral>(() => ({lat: 26.1158,lng: 91.7086}), []);

    const options = useMemo<google.maps.MapOptions>(() => ({ disableDefaultUI: true, zoomControl: true }), []);


    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const latLng = event.latLng?.toJSON();
        if (latLng) {
            setModalPosition(latLng);
        }
    }
    const handleMarkerClick = (position: google.maps.LatLngLiteral) => {
        removeMarker(position);
        setHoveredMarker(null);
    }

    const handleSaveLocation = (name: string) => {
        if (modalPosition && name) {
            addMarker({ position: modalPosition, name });
        }
        setModalPosition(null);
    }

    const handleViewMarkerClick = (position: google.maps.LatLngLiteral) => {
        if (map) {
            map.panTo(position);
            map.setZoom(16);
            setSelectedMarker(position);
        }
    };

    const handleResetCenter = () => {
        if (map) {
            map.panTo(mapCenter);
            map.setZoom(13);
            setSelectedMarker(null);
        }
    };

    console.log(selectedLocations,'pppp')

    return (
        <div className="flex h-screen w-full bg-gray-100 relative">
            <LocationModal
                isOpen={modalPosition !== null}
                onClose={() => setModalPosition(null)}
                onSave={handleSaveLocation}
                position={modalPosition}
            />
            <div className="absolute h-[600px] max-h-[80vh] w-[320px] top-8 left-8 z-[10] overflow-y-auto scrollbar-hide">
                <ViewMarkers 
                    markers={selectedLocations} 
                    onMarkerClick={handleViewMarkerClick}
                    selectedMarker={selectedMarker}
                />
            </div>
            <button
                onClick={handleResetCenter}
                className="absolute bottom-8 right-8 z-[10] bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50"
            >
                Reset View
            </button>
            <div className="relative w-full h-full">
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={13}
                    center={mapCenter}
                    options={options}
                    onClick={handleMapClick}
                    onLoad={(map) => setMap(map)}
                >
                    {selectedLocations.map((location, index) => (
                        console.log(location,'location'),
                        <MarkerF 
                            key={`${location.position.lat}-${location.position.lng}-${index}`} 
                            position={location.position} 
                            onClick={() => handleMarkerClick(location.position)}
                            onMouseOver={() => setHoveredMarker(location.position)}
                            onMouseOut={() => setHoveredMarker(null)}
                            icon={{
                                url: selectedMarker?.lat === location.position.lat && 
                                     selectedMarker?.lng === location.position.lng
                                    ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                    : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                scaledSize: new window.google.maps.Size(32, 32)
                            }}
                        />
                    ))}
                    
                    {hoveredMarker && (
                        <InfoWindow
                            position={hoveredMarker}
                            options={{
                                pixelOffset: new window.google.maps.Size(0, -40),
                                disableAutoPan: true
                            }}
                        >
                            <div className="p-1 rounded-lg bg-white shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Location Details
                                </h3>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-600">
                                        Name: {selectedLocations.find(loc => loc.position.lat === hoveredMarker.lat && loc.position.lng === hoveredMarker.lng)?.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Lat: {hoveredMarker.lat.toFixed(4)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Lng: {hoveredMarker.lng.toFixed(4)}
                                    </p>
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>
        </div>
    )
}

export default Map
