import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../../firebase";
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
import FullPageLoadingSpinner from "../FullPageLoadingSpinner";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import ProfileInfo from "../ProfileInfo";

const OfferDetailsPage = () => {
  const { offerId } = useParams();
  const [currentUser] = useAuthState(getAuth(firebaseApp));

  const [offer, loading, error, snapshot] = useDocumentData(
    doc(getFirestore(firebaseApp), "cars", offerId)
  );

  const [profile] = useDocumentData(
    offer?.owner_id &&
      doc(getFirestore(firebaseApp), "profiles", offer.owner_id)
  );

  const [osmLocation, setOsmLocation] = useState(null);
  const navigate = useNavigate();

  const removeOffer = async () => {
    if (!snapshot) return;
    try {
      await deleteDoc(snapshot.ref);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

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
      {loading && <FullPageLoadingSpinner />}
      {error && (
        <div className="alert alert-danger" role="alert">
          {labels.THERE_WAS_AN_UNEXPECTED_ERROR}: {error.message}
        </div>
      )}
      {offer && (
        <>
          <img
            className="img-fluid border mt-3"
            src={offer.photo_url || NO_PHOTO_URL}
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
          {profile && (
            <div className="mb-3">
              <ProfileInfo
                name={profile.name}
                email={profile.email}
                phoneNumber={profile.phone_number}
                photoUrl={profile.photo_url}
              />
            </div>
          )}
          {currentUser?.uid === offer.owner_id ? (
            <div className="d-flex ms-2">
              {!profile && (
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => navigate(`/${PATHS.PROFILE}`)}
                >
                  {labels.CREATE_PROFILE}
                </button>
              )}
              <button className="btn btn-danger" onClick={removeOffer}>
                {labels.REMOVE_OFFER}
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/${PATHS.CHATS}/${offer.owner_id}`)}
            >
              {labels.CONTACT_SELLER}
            </button>
          )}
          <hr />
          {offer.features && offer.features.length > 0 && (
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
      {!offer && !loading && !error && (
        <h2 className="text-center mt-3">{labels.OFFER_DOES_NOT_EXIST}</h2>
      )}
    </div>
  );
};

export default OfferDetailsPage;
