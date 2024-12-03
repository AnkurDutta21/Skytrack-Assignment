import { useState } from 'react';
import { FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { MdChevronRight } from "react-icons/md";

interface Marker {
    name: string;
    position: google.maps.LatLngLiteral;
}

interface ViewMarkersProps {
    markers: Marker[];
    onMarkerClick: (position: google.maps.LatLngLiteral) => void;
    selectedMarker: google.maps.LatLngLiteral | null;
    onDeleteMarker: (position: google.maps.LatLngLiteral) => void;
}

const ViewMarkers = ({ markers, onMarkerClick, selectedMarker, onDeleteMarker }: ViewMarkersProps) => {
    const [searchMarkers, setSearchMarkers] = useState("");

    const filteredMarkers = markers.filter(marker =>
        marker.name.toLowerCase().includes(searchMarkers.toLowerCase())
    );

    return (
        <div className="p-4 bg-white/90 backdrop-blur-md rounded-t-2xl shadow-lg border border-gray-200 lg:rounded-2xl max-h-full overflow-y-auto scrollbar-hide">
            <div className="flex items-center gap-2 mb-4">
                <FaMapMarkerAlt className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-800">Locations</h2>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search location"
                    value={searchMarkers}
                    onChange={(e) => setSearchMarkers(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
            </div>

            {!filteredMarkers.length ? (
                <div className="flex items-center gap-2 text-gray-400 py-4">
                    <IoLocationSharp className="w-4 h-4" />
                    <p className="text-sm">
                        {searchMarkers ? "No matching locations found" : "No locations saved yet"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3 max-h-36 lg:max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {filteredMarkers.map((marker, idx) => (
                        <div
                            key={idx}
                            className={`px-4 pt-4 pb-8 rounded-xl flex items-center justify-between transition-all duration-200
                                ${selectedMarker?.lat === marker.position.lat &&
                                    selectedMarker?.lng === marker.position.lng
                                    ? 'bg-blue-50 border border-blue-100 shadow-sm'
                                    : 'hover:bg-gray-50 border border-transparent'}`}
                        >
                            <div
                                className="flex-1 cursor-pointer"
                                onClick={() => onMarkerClick(marker.position)}
                            >
                                <p className="font-medium text-gray-800 mb-1 flex items-center gap-2">
                                    <IoLocationSharp
                                        className={`w-4 h-4 ${selectedMarker?.lat === marker.position.lat
                                            ? 'text-blue-500'
                                            : 'text-gray-400'
                                            }`}
                                    />
                                    {marker.name}
                                </p>
                                <div className="text-xs text-gray-500 font-light flex gap-3">
                                    <p>{marker.position.lat.toFixed(4)}°N</p>
                                    <p>{marker.position.lng.toFixed(4)}°E</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteMarker(marker.position);
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
                                <MdChevronRight className={`w-5 h-5 transition-colors ${selectedMarker?.lat === marker.position.lat
                                    ? 'text-blue-500'
                                    : 'text-gray-300'
                                    }`} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewMarkers;
