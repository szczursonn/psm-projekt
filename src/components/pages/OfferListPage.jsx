import { getFirestore, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../../firebase";
import OfferListItem from "../OfferListItem";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../consts";
import { labels } from "../../labels";
import FullPageLoadingSpinner from "../FullPageLoadingSpinner";
import SortOffers from "../Dropdown";

const OfferListPage = () => {
  const [snapshot, loading, error] = useCollection(
    collection(getFirestore(firebaseApp), "cars")
  );

  const navigate = useNavigate();

  const onOfferClick = (offerId) => {
    navigate(`/${PATHS.OFFER_DETAILS}/${offerId}`);
  };


  if (snapshot == undefined){
    console.log('No matching documents');
    return;
  }

  let vehicles = [];
  snapshot.docs.forEach(doc => {
    vehicles.push(doc.data());
  })

  let url = window.location.href.split('/').at(-1);

  if (url == 'price-asc') {
    vehicles.sort((a, b) => a.price - b.price);
  } else if (url == 'price-desc') {
    vehicles.sort((a, b) => b.price - a.price);
  } else if (url == 'year-asc') {
    vehicles.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  } else if (url == 'year-desc') {
    vehicles.sort((a, b) => parseInt(b.year) - parseInt(a.year));
  } else if (url == 'mile-asc') {
    vehicles.sort((a, b) => a.miles - b.miles);
  } else if (url == 'mile-desc') {
    vehicles.sort((a, b) => b.miles - a.miles);
  }

  return (
    <div className="container-fluid mb-4">
      <SortOffers state="" />
      {loading && <FullPageLoadingSpinner />}
      {error && (
        <div className="alert alert-danger" role="alert">
          {labels.THERE_WAS_AN_UNEXPECTED_ERROR}: {error.message}
        </div>
      )}
      {snapshot && (
        <div className="row align-items-start ms-1 me-1">
          {vehicles.map((doc) => (
            <OfferListItem
              key={doc.id}
              offer={doc}
              onClick={() => onOfferClick(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferListPage;
