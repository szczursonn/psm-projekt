import { getFirestore, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../firebase";
import OfferListItem from "./OfferListItem";

const OfferList = ({ onOfferClick }) => {
  const [snapshot, loading, error] = useCollection(
    collection(getFirestore(firebaseApp), "cars")
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
      {snapshot && (
        <div className="row align-items-start">
          {snapshot.docs.map((doc) => (
            <OfferListItem
              key={doc.id}
              car={doc.data()}
              onClick={() => onOfferClick(doc.id)}
            />
          ))}
          {snapshot.empty && <p>no cars :(</p>}
        </div>
      )}
    </div>
  );
};

export default OfferList;
