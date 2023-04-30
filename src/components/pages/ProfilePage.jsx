import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../../firebase";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import FullPageLoadingSpinner from "../FullPageLoadingSpinner";
import ProfilePageCreateForm from "../ProfilePageCreateForm";
import { labels } from "../../labels";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../consts";
import ProfileInfo from "../ProfileInfo";

const ProfilePage = () => {
  const [currentUser, loadingUser, userError] = useAuthState(
    getAuth(firebaseApp)
  );
  const [profile, loadingProfile, profileError] = useDocumentData(
    currentUser?.uid &&
      doc(getFirestore(firebaseApp), "profiles", currentUser?.uid)
  );
  const loading = loadingUser || loadingProfile;
  const error = userError || profileError;

  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const onSubmit = async (newProfile) => {
    setSaving(true);
    setSavingError(null);
    try {
      await setDoc(
        doc(getFirestore(firebaseApp), "profiles", currentUser.uid),
        newProfile
      );
      setIsEditMode(false);
    } catch (err) {
      console.error(err);
      setSavingError(err);
    } finally {
      setSaving(false);
    }
  };

  const navigate = useNavigate();

  if (loading) {
    return <FullPageLoadingSpinner />;
  }

  if (currentUser === null) {
    return (
      <div className="container-fluid">
        <div className="d-flex flex-column">
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate(`/${PATHS.SIGN_IN}`)}
          >
            {labels.SIGN_IN}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {error && (
        <div className="alert alert-danger" role="alert">
          {labels.THERE_WAS_AN_UNEXPECTED_ERROR}: {error.message}
        </div>
      )}
      {profile && !isEditMode && (
        <>
          <ProfileInfo
            name={profile.name}
            email={profile.email}
            phoneNumber={profile.phone_number}
            showNull={true}
          />
          <hr />
          <button
            className="btn btn-outline-primary"
            onClick={() => setIsEditMode(true)}
          >
            {labels.UPDATE_PROFILE}
          </button>
        </>
      )}
      {!loading && !error && !profile && !isEditMode && (
        <div className="d-flex flex-column">
          <h2 className="mt-3">{labels.USER_NO_PROFILE}</h2>
          <button
            className="btn btn-primary mt-3"
            onClick={() => setIsEditMode(true)}
          >
            {labels.CREATE_PROFILE}
          </button>
        </div>
      )}
      {isEditMode && (
        <ProfilePageCreateForm
          onSubmit={onSubmit}
          onBack={() => setIsEditMode(false)}
          disabled={saving}
          error={savingError}
          existing={profile}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default ProfilePage;
