import { GoogleMap } from '@react-google-maps/api'
import { useCallback, useMemo, useRef } from 'react';

const Map = () => {
    const mapRef = useRef<google.maps.Map>();
    const mapStyles = {
        height: '100vh',
        width: '100%'
    }
    const mapCenter = useMemo<google.maps.LatLngLiteral>(() => ({
        lat: 26.1158,
        lng: 91.7086
    }), []);
    const options = useMemo<google.maps.MapOptions>(() => ({
        disableDefaultUI: true, 
        zoomControl: true,
    }), []);
    const onload = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);
  return (
    <div style={{display: 'flex', height: '100vh'}}>
        <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13} 
        center={mapCenter}
        options={options}
        onLoad={onload}
        />
    </div>
  )
}

export default Map
