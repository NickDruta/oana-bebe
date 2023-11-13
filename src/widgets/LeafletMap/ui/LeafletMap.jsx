import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import mapMarkerIcon from "shared/assets/icons/mapMarker.svg";
import cls from "./LeafletMap.module.scss";

const customIcon = L.icon({
  iconUrl: mapMarkerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const LeafletMap = () => {
  return (
    <MapContainer center={[47.0437225, 28.8660977]} zoom={15} className={cls.mapWrapper}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[47.0437225, 28.8660977]} icon={customIcon}/>
    </MapContainer>
  );
};

export default LeafletMap;
