import { useEffect, useRef, useState } from "react";

const DEFAULT_MAP_ZOOM = 12;
const MINIMAL_MAP_CIRCLE_RADIUS = 500;
const MAP_CIRCLE_FALLBACK_RADIUS = 1000;
const DEGREE_TO_METERS_MULTIPLIER = 111_139;
const BLANK_OPACITY = "50%";

export const getMapCircleRadius = (boundingBox) => {
  boundingBox = boundingBox.map((n) => parseFloat(n));
  const radius =
    ((Math.abs(boundingBox[0] - boundingBox[1]) +
      Math.abs(boundingBox[2] - boundingBox[3])) *
      DEGREE_TO_METERS_MULTIPLIER) /
    4;
  return radius;
};

const OfferLocationMap = ({ osmLocation }) => {
  const [reactLeaflet, setReactLeaflet] = useState(null);

  useEffect(() => {
    import("react-leaflet").then((module) => {
      setReactLeaflet(module);
    });
  }, []);

  const featureGroupRef = useRef();

  const center = osmLocation ? [osmLocation.lat, osmLocation.lon] : [0, 0];
  const radius = Math.max(
    osmLocation?.boundingbox
      ? getMapCircleRadius(osmLocation.boundingbox)
      : MAP_CIRCLE_FALLBACK_RADIUS,
    MINIMAL_MAP_CIRCLE_RADIUS
  );

  useEffect(() => {
    // workaround
    setTimeout(() => {
      if (!featureGroupRef.current) return;
      const bounds = featureGroupRef.current.getBounds();
      if (bounds.isValid()) {
        featureGroupRef.current._map.fitBounds(bounds);
      }
    }, 0);
  }, [center]);

  if (!reactLeaflet) {
    return <></>;
  }

  const { MapContainer, TileLayer, FeatureGroup, Circle } = reactLeaflet;

  return (
    <div
      className="border border-2"
      style={{ opacity: osmLocation ? "100%" : BLANK_OPACITY }}
    >
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
          {osmLocation && <Circle center={center} radius={radius} />}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default OfferLocationMap;
