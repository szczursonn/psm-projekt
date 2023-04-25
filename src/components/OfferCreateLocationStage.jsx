import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { searchLocation, getLocationByCoords } from "../locationAPI";
import OfferLocationMap from "./OfferLocationMap";
import { labels } from "../labels";

const DEBOUNCE_MS = 1500;

const OfferCreateLocationStage = forwardRef(
  ({ offerToCreate, setNavBlocked }, ref) => {
    const [osmLocation, setOsmLocation] = useState(
      offerToCreate?.location || null
    );
    const [locationQuery, setOsmLocationQuery] = useState(
      offerToCreate?.locationQuery || ""
    );
    const [inputBlocked, setInputBlocked] = useState(false);
    const [error, setError] = useState(null);

    useImperativeHandle(ref, () => ({
      getData() {
        return {
          location: osmLocation,
          locationQuery,
        };
      },
    }));

    useEffect(() => {
      if (offerToCreate?.locationQuery === locationQuery) {
        setOsmLocation(offerToCreate?.location || null);
        setNavBlocked(false);
        setError(null);
        return;
      }

      if (locationQuery) {
        setNavBlocked(true);
        const debounceTimeout = setTimeout(lookupLocation, DEBOUNCE_MS);
        return () => clearTimeout(debounceTimeout);
      } else {
        setOsmLocation(null);
        setNavBlocked(false);
        setError(null);
      }
    }, [locationQuery]);

    const lookupLocation = async () => {
      setError(null);
      setInputBlocked(true);
      try {
        const loc = await searchLocation(locationQuery);
        if (loc) {
          setOsmLocation(loc);
        } else {
          setOsmLocation(null);
          setError(labels.UNABLE_TO_FIND_LOCATION_ERROR);
        }
      } catch (err) {
        console.error(err);
        setOsmLocation(null);
        setError(err);
      } finally {
        setInputBlocked(false);
        setNavBlocked(false);
      }
    };

    const lookupLocationFromGPS = async () => {
      setInputBlocked(true);
      setNavBlocked(true);
      setError(null);
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const newOsmLocation = await getLocationByCoords(
          pos.coords.latitude,
          pos.coords.longitude
        );
        if (newOsmLocation) {
          setOsmLocation(newOsmLocation);
        } else {
          setOsmLocation(null);
          setError(labels.UNABLE_TO_FIND_LOCATION_ERROR);
        }
      } catch (err) {
        console.error(err);
        if (err instanceof GeolocationPositionError) {
          setError(err.message);
        } else {
          setError(err);
        }
        setOsmLocation(null);
      } finally {
        setInputBlocked(false);
        setNavBlocked(false);
      }
    };

    return (
      <div>
        <div className="d-flex flex-column mt-3 mb-3">
          <input
            className="form-control"
            type="text"
            name="location"
            placeholder={labels.LOCATION}
            required
            value={locationQuery}
            onInput={(e) => setOsmLocationQuery(e.currentTarget.value)}
            disabled={inputBlocked}
          ></input>
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={lookupLocationFromGPS}
            disabled={inputBlocked}
          >
            {labels.GET_CURRENT_LOCATION}
          </button>
        </div>
        {error && (
          <p className="text-danger fw-bold mb-3">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        )}
        <div className="mt-4"></div>
        <p>{osmLocation?.display_name || labels.LOCATION_FORM_EMPTY_HINT}</p>
        <OfferLocationMap osmLocation={osmLocation} />
      </div>
    );
  }
);

export default OfferCreateLocationStage;
