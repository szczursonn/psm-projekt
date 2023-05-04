import { createElement, useRef, useState } from "react";
import OfferCreateBasicInfoStage from "../OfferCreateBasicInfoStage";
import OfferCreateFeaturesStage from "../OfferCreateFeaturesStage";
import OfferCreateLocationStage from "../OfferCreateLocationStage";
import OfferCreateMediaStage from "../OfferCreateMediaStage";
import { COLLECTIONS, PATHS, STORAGE_DIRECTORIES } from "../../consts";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  ref as storageRef,
  getStorage,
  getDownloadURL,
} from "firebase/storage";
import { useUploadFile } from "react-firebase-hooks/storage";
import { firebaseApp } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { labels } from "../../labels";
import FullPageLoadingSpinner from "../FullPageLoadingSpinner";

const STAGES = [
  { name: labels.BASIC_INFO, component: OfferCreateBasicInfoStage },
  { name: labels.FEATURES, component: OfferCreateFeaturesStage },
  { name: labels.LOCATION, component: OfferCreateLocationStage },
  { name: labels.PHOTO, component: OfferCreateMediaStage },
];

const LAST_STAGE_INDEX = STAGES.length - 1;

const OfferCreatePage = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [offerToCreate, setOfferToCreate] = useState({});
  const [navBlocked, setNavBlocked] = useState(false);

  const [uploadFile, uploading, snapshot] = useUploadFile();

  const stageRef = useRef();
  const navigate = useNavigate();

  const onStageChange = (type) => () => {
    const offerDiff = stageRef.current.getData();
    if (offerDiff === null) return;

    const newOfferToCreate = {
      ...offerToCreate,
      ...offerDiff,
    };

    setOfferToCreate(newOfferToCreate);

    switch (type) {
      case "back":
        setStageIndex(stageIndex - 1);
        break;
      case "next":
        if (stageIndex === LAST_STAGE_INDEX) {
          createOffer(newOfferToCreate);
        } else {
          setStageIndex(stageIndex + 1);
        }
        break;
    }
  };

  const createOffer = async (offer) => {
    setSaving(true);

    try {
      let photoUrl = null;

      if (offer.file) {
        const fileRef = storageRef(
          getStorage(firebaseApp),
          `${STORAGE_DIRECTORIES.OFFER_PHOTOS}/${Math.round(
            Math.random() * 1e17
          ).toString(36)}_${offer.file.name}`
        );
        await uploadFile(fileRef, offer.file);
        photoUrl = await getDownloadURL(fileRef);
      }

      const offerDoc = await addDoc(
        collection(getFirestore(firebaseApp), COLLECTIONS.OFFERS),
        {
          manufacturer: offer.manufacturer,
          model: offer.model,
          year: offer.year,
          price: offer.price ? parseInt(offer.price) : null,
          features: offer.features,
          miles: offer.miles ? parseInt(offer.miles) : null,
          location_osm_id: offer.location
            ? `${offer.location.osm_type[0].toUpperCase()}${
                offer.location.osm_id
              }`
            : null,
          created_at: new Date(),
          owner_id: getAuth(firebaseApp).currentUser.uid,
          photo_url: photoUrl,
          horses: offer.horses ? parseInt(offer.horses) : null,
          fuel_type: offer.fuelType || null,
        }
      );

      navigate(`/${PATHS.OFFER_DETAILS}/${offerDoc.id}`);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid mt-3">
      {saving ? (
        <FullPageLoadingSpinner>
          {uploading && (
            <div className="progress mb-2">
              <div
                className="progress-bar"
                style={{
                  width: snapshot
                    ? `${
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                      }%`
                    : "0%",
                }}
              ></div>
            </div>
          )}
        </FullPageLoadingSpinner>
      ) : (
        <>
          <h5>
            {stageIndex + 1}/{LAST_STAGE_INDEX + 1} - {STAGES[stageIndex].name}
          </h5>

          <div className="progress mb-2">
            <div
              className="progress-bar"
              style={{
                width: `${((stageIndex + 1) / (LAST_STAGE_INDEX + 2)) * 100}%`,
              }}
            ></div>
          </div>

          <hr />

          {STAGES[stageIndex] ? (
            createElement(STAGES[stageIndex].component, {
              offerToCreate,
              ref: stageRef,
              setNavBlocked,
            })
          ) : (
            <></>
          )}

          <hr />

          <div
            className="d-flex mt-2"
            style={{ justifyContent: "space-between" }}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={onStageChange("back")}
              disabled={navBlocked || stageIndex === 0}
              style={{ opacity: stageIndex === 0 ? "0%" : "100%" }}
            >
              {labels.BACK}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onStageChange("next")}
              disabled={navBlocked}
            >
              {stageIndex === LAST_STAGE_INDEX
                ? labels.CREATE_OFFER
                : labels.NEXT}
            </button>
          </div>
        </>
      )}

      {error && (
        <div className="text-danger fw-bold mb-3">
          {`${labels.THERE_WAS_AN_UNEXPECTED_ERROR}: ${JSON.stringify(error)}`}
        </div>
      )}
    </div>
  );
};

export default OfferCreatePage;
