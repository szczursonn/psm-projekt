import { getFirestore, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../../firebase";
import OfferListItem from "../OfferListItem";
import { useNavigate, useSearchParams } from "react-router-dom";
import { COLLECTIONS, PATHS } from "../../consts";
import { labels } from "../../labels";
import FullPageLoadingSpinner from "../FullPageLoadingSpinner";
import { sortBy } from "../../utils";
import { useState } from "react";

const SORTING_OPTIONS = {
  "price-asc": {
    label: labels.SORTING_OPTIONS.PRICE_ASC,
    fn: sortBy("price"),
  },
  "price-desc": {
    label: labels.SORTING_OPTIONS.PRICE_DESC,
    fn: sortBy("price", true),
  },
  "year-asc": {
    label: labels.SORTING_OPTIONS.YEAR_ASC,
    fn: sortBy("year"),
  },
  "year-desc": {
    label: labels.SORTING_OPTIONS.YEAR_DESC,
    fn: sortBy("year", true),
  },
  "mile-asc": {
    label: labels.SORTING_OPTIONS.MILES_ASC,
    fn: sortBy("miles"),
  },
  "mile-desc": {
    label: labels.SORTING_OPTIONS.MILES_DESC,
    fn: sortBy("miles", true),
  },
};

const SORTING_PARAMETER = "sortby";

const OfferListPage = () => {
  const [snapshot, loading, error] = useCollection(
    collection(getFirestore(firebaseApp), COLLECTIONS.OFFERS)
  );
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentSorting = SORTING_OPTIONS[searchParams.get(SORTING_PARAMETER)];
  const offers = snapshot
    ? snapshot.docs.map((doc) => ({
        ...doc.data(),
        _id: doc.id,
      }))
    : null;
  if (offers && currentSorting) {
    offers.sort(currentSorting.fn);
  }

  const onOfferClick = (offerId) => {
    navigate(`/${PATHS.OFFER_DETAILS}/${offerId}`);
  };

  const onDropdownButtonClick = () => {
    if (dropdownOpened) {
      onSortingSelect("");
    }
    setDropdownOpened(!dropdownOpened);
  };

  const onSortingSelect = (key) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (key) {
      newSearchParams.set(SORTING_PARAMETER, key);
    } else {
      newSearchParams.delete(SORTING_PARAMETER);
    }
    setSearchParams(newSearchParams);
    setDropdownOpened(false);
  };

  return (
    <div className="container-fluid mb-4">
      {loading && <FullPageLoadingSpinner />}
      {error && (
        <div className="alert alert-danger" role="alert">
          {labels.THERE_WAS_AN_UNEXPECTED_ERROR}: {error.message}
        </div>
      )}
      {offers && (
        <div className="row align-items-start ms-1 me-1">
          <div className="dropdown mt-3">
            <button
              className="btn btn-success dropdown-toggle"
              onClick={onDropdownButtonClick}
            >
              {currentSorting?.label || labels.SORT_OFFERS}
            </button>
            <ul className={`dropdown-menu${dropdownOpened ? " show" : ""}`}>
              {Object.entries(SORTING_OPTIONS).map(([key, opt]) => (
                <li
                  key={key}
                  className="dropdown-item pt-2 pb-2"
                  onClick={() => onSortingSelect(key)}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>
          {offers.map((offer) => (
            <OfferListItem
              key={offer._id}
              offer={offer}
              onClick={() => onOfferClick(offer._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferListPage;
