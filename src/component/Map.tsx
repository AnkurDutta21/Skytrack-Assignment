import { Autocomplete, GoogleMap, MarkerF } from '@react-google-maps/api';
import { useMemo, useRef, useState } from 'react';
import ViewMarkers from './ViewMarkers';
import LocationModal from './LocationModal';
import { useLocalStorageMarkers } from '../hooks/useLocalStorageMarkers';
import PopupComponent from './PopupComponent';
import { MdOutlineMyLocation } from 'react-icons/md';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';

const Map = () => {
    const { markers: savedMarkers, addMarker, removeMarker } = useLocalStorageMarkers();

    const [activeMarker, setActiveMarker] = useState<google.maps.LatLngLiteral | null>(null);
    const [highlightedMarker, setHighlightedMarker] = useState<google.maps.LatLngLiteral | null>(null);
    const [modalCoords, setModalCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const [searchQuery, setSearchQuery] = useState<google.maps.places.Autocomplete | null>(null);
    const [searchMarker, setSearchMarker] = useState<google.maps.LatLngLiteral | null>(null);
    const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);

    const mapStyles = { height: '100vh', width: '100%' };
    const initialCenter = useMemo(() => ({ lat: 26.1158, lng: 91.7086 }), []);
    const mapOptions = useMemo(() => ({
        zoomControl: true,
        disableDefaultUI: true,
    }), []);

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const coords = event.latLng?.toJSON();
        if (coords) {
            setModalCoords(coords);
        }
    };

    const handleSaveLocation = (name: string) => {
        if (modalCoords && name) {
            addMarker({ position: modalCoords, name });
        }
        setModalCoords(null);
    };

    const handleMarkerClick = (position: google.maps.LatLngLiteral) => {
        if (mapInstance) {
            mapInstance.panTo(position);
            mapInstance.setZoom(16);
            setHighlightedMarker(position);
        }
    };

    const handleResetView = () => {
        if (mapInstance) {
            mapInstance.panTo(initialCenter);
            mapInstance.setZoom(13);
            setHighlightedMarker(null);
        }
    };

    const onPlaceSelected = () => {
        const place = searchQuery?.getPlace();
        if (place?.geometry?.location) {
            const newPosition = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            if (mapInstance) {
                mapInstance.panTo(newPosition);
                mapInstance.setZoom(16);
                setSearchMarker(newPosition);
            }
            setHighlightedMarker(newPosition);
        }
    };

    return (
        <div className="relative flex flex-col h-screen w-full bg-gray-50">
            {isSearchBoxVisible && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md pointer-events-auto">
                    <Autocomplete
                        onLoad={setSearchQuery}
                        onPlaceChanged={onPlaceSelected}
                    >
                        <div className="relative">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search locations..."
                                className="w-full px-4 py-2 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            <button
                                onClick={() => setIsSearchBoxVisible(false)}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <AiOutlineClose size={20} />
                            </button>
                        </div>
                    </Autocomplete>
                </div>
            )}
            {!isSearchBoxVisible && (
                <button
                    onClick={() => setIsSearchBoxVisible(true)}
                    className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-md hover:bg-gray-100 transition duration-200"
                >
                    <AiOutlineSearch size={20} />
                </button>
            )}

            <LocationModal
                isOpen={modalCoords !== null}
                onClose={() => {
                    setModalCoords(null);
                }}
                onSave={handleSaveLocation}
                position={modalCoords}
            />

            <div className="relative flex-grow w-full h-full">
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={13}
                    center={initialCenter}
                    options={mapOptions}
                    onClick={handleMapClick}
                    onLoad={(map) => setMapInstance(map)}
                >
                    {savedMarkers.map((location, index) => (
                        <MarkerF
                            key={`${location.position.lat}-${location.position.lng}-${index}`}
                            position={location.position}
                            onClick={() => setActiveMarker(location.position)}
                            icon={{
                                url: highlightedMarker?.lat === location.position.lat &&
                                    highlightedMarker?.lng === location.position.lng
                                    ? '/assets/placeholder.png'
                                    : '/assets/pin-icn.png',
                                scaledSize: new window.google.maps.Size(24, 24)
                            }}
                        />
                    ))}
                    {initialCenter && (
                        <MarkerF
                            position={initialCenter}
                            icon={{
                                url: '/assets/your-location.png', 
                                scaledSize: new window.google.maps.Size(32, 32), 
                            }}
                        />
                    )}
                    

                    {searchMarker && (
                        <MarkerF
                            position={searchMarker}
                            icon={{
                                url: '/assets/gps.png',
                                scaledSize: new window.google.maps.Size(32, 32),
                            }}
                        />
                    )}

                    {activeMarker && (
                        <PopupComponent
                            position={activeMarker}
                            onClose={() => {
                                setActiveMarker(null);
                            }}
                            name={savedMarkers.find(loc =>
                                loc.position.lat === activeMarker.lat &&
                                loc.position.lng === activeMarker.lng
                            )?.name || ''}
                        />
                    )}
                </GoogleMap>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-10 max-h-[50vh] lg:max-h-[70vh] lg:w-[350px] lg:top-20 lg:bottom-auto lg:left-10 transition-transform duration-300 pointer-events-none">
                <div className="h-full overflow-y-auto scrollbar-hide pointer-events-auto bg-white/90 backdrop-blur-sm rounded-t-2xl lg:rounded-2xl shadow-lg">
                    <ViewMarkers
                        markers={savedMarkers}
                        onMarkerClick={handleMarkerClick}
                        selectedMarker={highlightedMarker}
                        onDeleteMarker={removeMarker}
                    />
                </div>
            </div>

            <button
                onClick={handleResetView}
                className="absolute max-w-fit bottom-5 right-4 lg:bottom-4 lg:left-4 lg:right-0 z-20 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 text-sm font-medium pointer-events-auto flex items-center gap-2"
            >
                <MdOutlineMyLocation className="w-4 h-4" />
                <span>Reset View</span>
            </button>
        </div>
    );
};

export default Map;
