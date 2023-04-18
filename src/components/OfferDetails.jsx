import { doc, getFirestore } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../firebase";

const OfferDetails = ({ carId }) => {
  const [car, loading, error] = useDocumentData(
    doc(getFirestore(firebaseApp), "cars", carId)
  );

  return (
    <div className="container-fluid">
      {loading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ marginTop: "300px" }}
        >
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          There was an error: {error.message}
        </div>
      )}
      {car && (
        <>
          <h2>{carId}</h2>
          <h2>{car.model}</h2>
        </>
      )}
    </div>
  );
};

export default OfferDetails;
