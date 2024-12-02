import { IoLocationSharp } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdChevronRight } from "react-icons/md";

interface ViewMarkersProps {
    markers: { position: google.maps.LatLngLiteral, name: string }[];
    onMarkerClick: (position: google.maps.LatLngLiteral) => void;
    selectedMarker: google.maps.LatLngLiteral | null;
}

const ViewMarkers = ({ markers, onMarkerClick, selectedMarker }: ViewMarkersProps) => {
    return (
        <div className="p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg m-4 max-w-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
                <FaMapMarkerAlt className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Saved Locations</h2>
            </div>
            
            {markers.length === 0 ? (
                <div className="flex items-center gap-2 text-gray-400 py-4">
                    <IoLocationSharp className="w-4 h-4" />
                    <p className="text-sm">No saved locations</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {markers.map((marker, index) => (
                        <div 
                            key={`${marker.position.lat}-${marker.position.lng}-${index}`}
                            className={`p-4 rounded-xl transition-all duration-200 cursor-pointer
                                flex items-center justify-between
                                ${selectedMarker?.lat === marker.position.lat && 
                                  selectedMarker?.lng === marker.position.lng 
                                    ? 'bg-blue-50 border border-blue-100 shadow-sm' 
                                    : 'hover:bg-gray-50 border border-transparent'}`}
                            onClick={() => onMarkerClick(marker.position)}
                        >
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                    <IoLocationSharp className={`w-4 h-4 ${
                                        selectedMarker?.lat === marker.position.lat ? 
                                        'text-blue-500' : 'text-gray-400'
                                    }`} />
                                    {marker.name}
                                </p>
                                <div className="text-xs text-gray-500 font-light flex gap-3">
                                    <p>{marker.position.lat.toFixed(4)}°N</p>
                                    <p>{marker.position.lng.toFixed(4)}°E</p>
                                </div>
                            </div>
                            <MdChevronRight className={`w-5 h-5 transition-colors ${
                                selectedMarker?.lat === marker.position.lat ?
                                'text-blue-500' : 'text-gray-300'
                            }`} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ViewMarkers