import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { getLocation, getLocationReverse } from "../locationAPI";
import OfferLocationMap from "./OfferLocationMap";

const DEBOUNCE_MS = 1500;

const OfferCreateLocationStage = forwardRef(
  ({ offerToCreate, setNavBlocked }, ref) => {
    const [location, setLocation] = useState(offerToCreate?.location || null);
    const [locationQuery, setLocationQuery] = useState(
      offerToCreate?.locationQuery || ""
    );
    const [inputBlocked, setInputBlocked] = useState(false);
    const [error, setError] = useState(null);

    useImperativeHandle(ref, () => ({
      getData() {
        return {
          location,
          locationQuery,
        };
      },
    }));

    useEffect(() => {
      if (offerToCreate?.locationQuery === locationQuery) {
        setLocation(offerToCreate?.location || null);
        setNavBlocked(false);
        setError(null);
        return;
      }

      if (locationQuery) {
        setNavBlocked(true);
        const debounceTimeout = setTimeout(lookupLocation, DEBOUNCE_MS);
        return () => clearTimeout(debounceTimeout);
      } else {
        setLocation(null);
        setNavBlocked(false);
        setError(null);
      }
    }, [locationQuery]);

    const lookupLocation = async () => {
      setError(null);
      setInputBlocked(true);
      try {
        const loc = await getLocation(locationQuery);
        if (loc) {
          setLocation(loc);
        } else {
          setLocation(null);
          setError("Couldn't find the location");
        }
      } catch (err) {
        console.error(err);
        setLocation(null);
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
        const loc = await getLocationReverse(
          pos.coords.latitude,
          pos.coords.longitude
        );
        if (loc) {
          setLocation(loc);
        } else {
          setLocation(null);
          setError("Couldn't find the location");
        }
      } catch (err) {
        console.error(err);
        if (err instanceof GeolocationPositionError) {
          setError(err.message);
        } else {
          setError(err);
        }
        setLocation(null);
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
            placeholder="Location"
            required
            value={locationQuery}
            onInput={(e) => setLocationQuery(e.currentTarget.value)}
            disabled={inputBlocked}
          ></input>
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={lookupLocationFromGPS}
            disabled={inputBlocked}
          >
            Get my current location
          </button>
        </div>
        {error && (
          <p className="text-danger fw-bold mb-3">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        )}
        <div className="mt-4"></div>
        <p>{location?.display_name || "Put in your location above!"}</p>
        <OfferLocationMap osmLocation={location} />
      </div>
    );
  }
);

export default OfferCreateLocationStage;
