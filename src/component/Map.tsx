import { GoogleMap, MarkerF } from '@react-google-maps/api'
import { useMemo, useState } from 'react';
import ViewMarkers from './ViewMarkers';
import LocationModal from './LocationModal';
import { useLocalStorageMarkers } from '../hooks/useLocalStorageMarkers';
import PopupComponent from './PopupComponent';
import { MdOutlineMyLocation } from 'react-icons/md';



const Map = () => {
    const { markers: savedMarkers, addMarker, removeMarker } = useLocalStorageMarkers();
    
    const [activeMarker, setActiveMarker] = useState<google.maps.LatLngLiteral | null>(null);
    const [highlightedMarker, setHighlightedMarker] = useState<google.maps.LatLngLiteral | null>(null);
    const [modalCoords, setModalCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    // const [searchQuery, setSearchQuery] = useState<google.maps.places.Autocomplete | null>(null);
    // const searchInputRef = useRef<HTMLInputElement>(null);

    const mapStyles = { height: '100vh', width: '100%' };
    const initialCenter = useMemo(() => ({ lat: 26.1158, lng: 91.7086 }), []);
    const mapOptions = useMemo(() => ({ zoomControl: true, disableDefaultUI: true }), []);

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

    // const onPlaceSelected = () => {
    //     const place = searchQuery?.getPlace();
    //     if (place?.geometry?.location) {
    //         const newPosition = {
    //             lat: place.geometry.location.lat(),
    //             lng: place.geometry.location.lng()
    //         };
    //         if (mapInstance) {
    //             mapInstance.panTo(newPosition);
    //             mapInstance.setZoom(16);
    //             setHighlightedMarker(newPosition);
    //         }
    //     }
    // };

    return (
        <div className="relative flex flex-col h-screen w-full bg-gray-50">
            {/* <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md pointer-events-auto">
                <Autocomplete
                    onLoad={setSearchQuery}
                    onPlaceChanged={onPlaceSelected}
                >
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search locations..."
                        className="w-full px-4 py-2 rounded-lg shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </Autocomplete>
            </div> */}
            <LocationModal
                isOpen={modalCoords !== null}
                onClose={()=>{
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
                                    ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                    : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                scaledSize: new window.google.maps.Size(32, 32)
                            }}
                        >
                            <div className="p-1 rounded-lg bg-white shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {location.name}
                                </h3>
                            </div>
                        </MarkerF>
                    ))}
                    
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

            <div className="absolute bottom-0 left-0 right-0 z-10 max-h-[50vh] lg:max-h-screen lg:w-[400px] lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:left-0 transition-transform duration-300 pointer-events-none">
                <div className="h-full overflow-y-auto scrollbar-hide pointer-events-auto">
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
                className="absolute bottom-5 max-w-fit right-4 lg:bottom-4 lg:left-4 z-20 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium pointer-events-auto"
            >
                <div className="flex items-center gap-2">
                    <MdOutlineMyLocation className="w-5 h-5" />
                    Reset
                </div>
            </button>
        </div>
    );
};

export default Map;
