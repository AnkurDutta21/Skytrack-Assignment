import { OverlayView } from '@react-google-maps/api';

const PopupComponent = ({ position, onClose, name }: { position: google.maps.LatLngLiteral, onClose: () => void, name: string }) => {

    const stopPropagation = (e: React.SyntheticEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const handleClose = (e: React.SyntheticEvent) => {
        stopPropagation(e);
        onClose();
    };

    return (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <div
                className="bg-white p-3 rounded-md shadow-xl border border-gray-200"
                style={{ transform: 'translate(-50%, -130%)', minWidth: '200px' }}
                onClick={stopPropagation}
                onTouchStart={stopPropagation}
            >
                <button
                    onClick={handleClose}
                    onTouchEnd={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ✕
                </button>
                <h3 className="text-base font-medium text-gray-800 mb-1">
                    Location Details
                </h3>
                <div className="space-y-0.5">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span> {name}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Lat:</span> {position.lat.toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Lng:</span> {position.lng.toFixed(4)}
                    </p>
                </div>
            </div>
        </OverlayView>
    );
};

export default PopupComponent;