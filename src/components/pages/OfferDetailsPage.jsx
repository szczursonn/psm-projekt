import { doc, getFirestore } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../../firebase";
import LoadingSpinner from "../LoadingSpinner";
import { useParams } from "react-router-dom";

const OfferDetailsPage = () => {
  const { offerId } = useParams();

  const [car, loading, error] = useDocumentData(
    doc(getFirestore(firebaseApp), "cars", offerId)
  );

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
      {car && (
        <>
          <h2>{offerId}</h2>
          <h2>{car.model}</h2>
        </>
      )}
    </div>
  );
};

export default OfferDetailsPage;
