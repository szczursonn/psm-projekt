import { doc, getFirestore } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../../firebase";
import LoadingSpinner from "../LoadingSpinner";
import OfferLocationMap from "../OfferLocationMap";
import { useNavigate, useParams } from "react-router-dom";
import {
  formatCurrency,
  formatDaysAgo,
  getOfferSubtitle,
  FUEL_TYPE_TO_LABEL,
} from "../../utils";
import { getLocationByOsmId } from "../../locationAPI";
import { useEffect, useState } from "react";
import { labels } from "../../labels";
import { NO_PHOTO_URL, PATHS } from "../../consts";

const OfferDetailsPage = () => {
  const { offerId } = useParams();

  const [offer, loading, error] = useDocumentData(
    doc(getFirestore(firebaseApp), "cars", offerId)
  );

  const [osmLocation, setOsmLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (offer?.location_osm_id) {
      getLocationByOsmId(offer.location_osm_id)
        .then((loc) => {
          setOsmLocation(loc);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [offer]);

  const subtitle = offer && getOfferSubtitle(offer);

  return (
    <div className="container-fluid">
      {loading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ marginTop: "250px", marginBottom: "250px" }}
        >
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {labels.THERE_WAS_AN_UNEXPECTED_ERROR}: {error.message}
        </div>
      )}
      {offer && (
        <>
          <img
            className="img-fluid border mt-3"
            src={offer.photoUrl || NO_PHOTO_URL}
          ></img>
          <h2 className="mt-2">
            {offer.manufacturer} {offer.model}
          </h2>
          <h5 className="text-muted">{subtitle}</h5>
          <h3 className="text-danger fw-bold mt-3">
            {offer.price ? formatCurrency(offer.price) : labels.ASK_FOR_PRICE}
          </h3>
          <h5 className="mt-3">
            {offer.created_at && formatDaysAgo(offer.created_at.toDate())}
          </h5>
          <h6 className="text-muted mt-1">ID: {offerId}</h6>
          <hr />
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/${PATHS.CHATS}/${offer.owner_id}`)}
          >
            {labels.CONTACT_SELLER}
          </button>
          <hr />
          {offer.features && (
            <>
              <h3>{labels.FEATURES}</h3>
              <ul>
                {offer.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <hr />
            </>
          )}

          {offer.location_osm_id && (
            <>
              <h3>{labels.LOCATION}</h3>
              <h6 className="fw-normal">{osmLocation?.display_name}</h6>
              <OfferLocationMap osmLocation={osmLocation} />
              <div className="mb-2"></div>
              <hr />
            </>
          )}

          <h3>{labels.DETAILS}</h3>
          <table className="table table-bordered">
            <tbody>
              {offer.manufacturer && (
                <tr>
                  <td>{labels.MANUFACTURER}</td>
                  <td>{offer.manufacturer}</td>
                </tr>
              )}
              {offer.model && (
                <tr>
                  <td>{labels.MODEL}</td>
                  <td>{offer.model}</td>
                </tr>
              )}
              {offer.year && (
                <tr>
                  <td>{labels.PRODUCTION_YEAR}</td>
                  <td>{offer.year}</td>
                </tr>
              )}
              {offer.miles && (
                <tr>
                  <td>{labels.MILEAGE}</td>
                  <td>{offer.miles} km</td>
                </tr>
              )}
              {offer.horses && (
                <tr>
                  <td>{labels.HORSEPOWER}</td>
                  <td>{offer.horses}</td>
                </tr>
              )}
              {offer.fuel_type && (
                <tr>
                  <td>{labels.FUEL_TYPE}</td>
                  <td>{FUEL_TYPE_TO_LABEL[offer.fuel_type]}</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default OfferDetailsPage;
