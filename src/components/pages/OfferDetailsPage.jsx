import { doc, getFirestore } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../../firebase";
import LoadingSpinner from "../LoadingSpinner";
import { useParams } from "react-router-dom";
import { formatCurrency, formatDaysAgo, getOfferSubtitle } from "../../utils";
import { FUEL_TYPE_LABELS } from "../../consts";

const OfferDetailsPage = () => {
  const { offerId } = useParams();

  const [offer, loading, error] = useDocumentData(
    doc(getFirestore(firebaseApp), "cars", offerId)
  );

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
          There was an error: {error.message}
        </div>
      )}
      {offer && (
        <>
          <img
            className="img-fluid border mt-3"
            src={offer.photoUrl || "/no-photo.jpg"}
          ></img>
          <h2 className="mt-2">
            {offer.manufacturer} {offer.model}
          </h2>
          <h5 className="text-muted">{subtitle}</h5>
          <h3 className="text-danger fw-bold mt-3">
            {offer.price ? formatCurrency(offer.price) : "Ask for price"}
          </h3>
          <div className="text-muted mt-3">
            {offer.created_at && formatDaysAgo(offer.created_at)}
          </div>
          <div className="text-muted mt-1">ID: {offerId}</div>
          <hr />
          <button className="btn btn-primary">Contact owner</button>
          <hr />
          <h3>Features</h3>
          <ul>
            {offer.features?.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <h3>Details</h3>
          <table className="table table-bordered">
            <tbody>
              {offer.manufacturer && (
                <tr>
                  <td>Manufacturer</td>
                  <td>{offer.manufacturer}</td>
                </tr>
              )}
              {offer.model && (
                <tr>
                  <td>Model</td>
                  <td>{offer.model}</td>
                </tr>
              )}
              {offer.year && (
                <tr>
                  <td>Production year</td>
                  <td>{offer.year}</td>
                </tr>
              )}
              {offer.miles && (
                <tr>
                  <td>Mileage</td>
                  <td>{offer.miles} km</td>
                </tr>
              )}
              {offer.horses && (
                <tr>
                  <td>Horsepower</td>
                  <td>{offer.horses}</td>
                </tr>
              )}
              {offer.fuel_type && (
                <tr>
                  <td>Fuel type</td>
                  <td>{FUEL_TYPE_LABELS[offer.fuel_type]}</td>
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
