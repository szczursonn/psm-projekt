import { createElement, useRef, useState } from "react";
import OfferCreateBasicInfoStage from "../OfferCreateBasicInfoStage";
import OfferCreateFeaturesStage from "../OfferCreateFeaturesStage";
import OfferCreateLocationStage from "../OfferCreateLocationStage";
import OfferCreateMediaStage from "../OfferCreateMediaStage";
import LoadingSpinner from "../LoadingSpinner";
import { PATHS } from "../../consts";
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

const STAGE_NAMES = {
  0: "Basic info",
  1: "Features",
  2: "Location",
  3: "Photo",
};

const STAGE_COMPONENTS = {
  0: OfferCreateBasicInfoStage,
  1: OfferCreateFeaturesStage,
  2: OfferCreateLocationStage,
  3: OfferCreateMediaStage,
};

const LAST_STAGE_INDEX = Object.keys(STAGE_COMPONENTS).length - 1;

const OfferCreatePage = () => {
  const [stage, setStage] = useState(0);
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
        setStage(stage - 1);
        break;
      case "next":
        if (stage === LAST_STAGE_INDEX) {
          createOffer(newOfferToCreate);
        } else {
          setStage(stage + 1);
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
          `offer_photos/${Math.round(Math.random() * 1e17).toString(36)}_${
            offer.file.name
          }`
        );
        await uploadFile(fileRef, offer.file);
        photoUrl = await getDownloadURL(fileRef);
      }

      const offerDoc = await addDoc(
        collection(getFirestore(firebaseApp), "cars"),
        {
          manufacturer: offer.manufacturer,
          model: offer.model,
          year: offer.year,
          price: parseFloat(offer.price),
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
      <h2>Add offer</h2>

      {saving ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ marginTop: "250px", marginBottom: "250px" }}
        >
          <LoadingSpinner />
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
        </div>
      ) : (
        <>
          <h5>
            {stage + 1}/{LAST_STAGE_INDEX + 1} - {STAGE_NAMES[stage]}
          </h5>

          <div className="progress mb-2">
            <div
              className="progress-bar"
              style={{
                width: `${((stage + 1) / (LAST_STAGE_INDEX + 2)) * 100}%`,
              }}
            ></div>
          </div>

          {STAGE_COMPONENTS[stage] ? (
            createElement(STAGE_COMPONENTS[stage], {
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
              disabled={navBlocked || stage === 0}
              style={{ opacity: stage === 0 ? "0%" : "100%" }}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onStageChange("next")}
              disabled={navBlocked}
            >
              {stage === LAST_STAGE_INDEX ? "Create offer" : "Next"}
            </button>
          </div>
        </>
      )}

      {error && (
        <div className="text-danger fw-bold mb-3">
          {`There was an unexpected error: ${JSON.stringify(error)}`}
        </div>
      )}
    </div>
  );
};

export default OfferCreatePage;
