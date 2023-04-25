import { getFirestore, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../../firebase";
import OfferListItem from "../OfferListItem";
import LoadingSpinner from "../LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../consts";
import { labels } from "../../labels";

const OfferListPage = () => {
  const [snapshot, loading, error] = useCollection(
    collection(getFirestore(firebaseApp), "cars")
  );

  const navigate = useNavigate();

  const onOfferClick = (offerId) => {
    navigate(`/${PATHS.OFFER_DETAILS}/${offerId}`);
  };

  return (
    <div className="container-fluid mb-4">
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
      {snapshot && (
        <div className="row align-items-start ms-1 me-1">
          {snapshot.docs.map((doc) => (
            <OfferListItem
              key={doc.id}
              offer={doc.data()}
              onClick={() => onOfferClick(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferListPage;
