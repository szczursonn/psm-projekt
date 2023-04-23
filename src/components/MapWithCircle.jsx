import { MapContainer, TileLayer, FeatureGroup, Circle } from "react-leaflet";
import { DEFAULT_MAP_ZOOM, MAP_CIRCLE_FALLBACK_RADIUS } from "../consts";
import { useEffect, useRef } from "react";

const MapWithCircle = ({ center, radius, disabled }) => {
  const featureGroupRef = useRef();

  useEffect(() => {
    if (!featureGroupRef.current) return;
    const bounds = featureGroupRef.current.getBounds();
    if (!bounds.isValid()) {
      return;
    }
    featureGroupRef.current._map.fitBounds(bounds);
  }, [center]);

  return (
    <div style={{ opacity: disabled ? "100%" : "50%" }}>
      <MapContainer
        center={center || [0, 0]}
        zoom={DEFAULT_MAP_ZOOM}
        zoomControl={false}
        style={{ height: "300px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup ref={featureGroupRef}>
          {center && (
            <Circle
              center={center}
              radius={radius || MAP_CIRCLE_FALLBACK_RADIUS}
            />
          )}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default MapWithCircle;
