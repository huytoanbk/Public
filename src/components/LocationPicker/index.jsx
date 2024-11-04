import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://www.svgrepo.com/show/38705/location-pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});
const LocationPicker = ({onLocationSelect, initLocation, isDefaultValue }) => {
  const [markerPosition, setMarkerPosition] = useState(initLocation || [21.037611288678807, 105.84295463547278]);
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if(isDefaultValue) {
          setMarkerPosition([e.latlng.lat, e.latlng.lng]);
          onLocationSelect([e.latlng.lat, e.latlng.lng])
        }
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={markerPosition}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler />
      <Marker position={markerPosition} icon={customMarkerIcon}>
        <Popup>
          Bạn đã chọn vị trí này!
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationPicker;
