import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Skeleton } from "antd";
import "./location-picker.css";
const customMarkerIcon = new L.Icon({
  iconUrl: "https://www.svgrepo.com/show/38705/location-pin.svg",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});


const DisableMapInteractions = () => {
  const map = useMap();
  map.dragging.disable();
  map.zoomControl.disable();
  map.touchZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.doubleClickZoom.disable();

  return null;
};

const LocationPicker = ({ onLocationSelect, initLocation, isDefaultValue, disabled = false, ...props }) => {
  const [showMap, setShowMap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(
    initLocation || [21.037611288678807, 105.84295463547278]
  );
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (isDefaultValue) {
          setMarkerPosition([e.latlng.lat, e.latlng.lng]);
          onLocationSelect([e.latlng.lat, e.latlng.lng]);
        }
      },
    });
    return null;
  };

  useEffect(() => {
    setTimeout(function () {
      setShowMap(true);
    }, 500);
  }, [showMap]);

  return (
    <>
      {showMap ? (
        <MapContainer
          center={markerPosition}
          zoom={13}
          style={{ height: "400px", width: "100%"}}
          {...props}
        >
          {disabled && <DisableMapInteractions />}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />
          <Marker position={markerPosition} icon={customMarkerIcon}>
            {isDefaultValue && <Popup>Bạn đã chọn vị trí này!</Popup>}
          </Marker>
        </MapContainer>
      ) : (
        <Skeleton
          style={{ height: "400px" }}
          active
          loading={!showMap}
          paragraph={false}
        />
      )}
    </>
  );
};

export default LocationPicker;
