import { useState } from "react";
import { labels } from "../labels";
import { NO_PHOTO_URL } from "../consts";

const ProfilePageCreateForm = ({
  onSubmit,
  onBack,
  disabled,
  error,
  existing,
  currentUser,
}) => {
  const [name, setName] = useState(existing?.name);
  const [email, setEmail] = useState(existing?.email);
  const [file, setFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(existing?.photo_url || null);

  const _onSubmit = async (e) => {
    e.preventDefault();

    onSubmit({
      name: e.target.name.value,
      email: e.target.email.value || null,
      phone_number: e.target.phone.value || null,
      photo: file,
      photo_url: photoUrl,
    });
  };

  const insertNameFromAuth = () => {
    setName(currentUser.displayName);
  };

  const insertEmailFromAuth = () => {
    setEmail(currentUser.email);
  };

  const insertPhotoFromAuth = () => {
    setFile(null);
    setPhotoUrl(currentUser.photoURL);
  };

  const shouldShowInsertLoginEmailButton =
    currentUser?.email && email !== currentUser.email;

  const shouldShowInsertNameButton =
    currentUser?.displayName && name !== currentUser.displayName;

  const shouldShowInsertPhotoButton =
    currentUser?.photoURL && photoUrl !== currentUser.photoURL;

  const onFileInput = (e) => {
    const file = e.target?.files?.[0];
    setFile(file || null);
    setPhotoUrl(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={_onSubmit}>
      <div className="mt-2">
        <label className="form-label">
          {labels.NAME}
          {shouldShowInsertNameButton && (
            <button
              className="btn btn-outline-dark btn-sm ms-2"
              type="button"
              onClick={insertNameFromAuth}
            >
              {labels.USE_LOGIN_NAME}
            </button>
          )}
        </label>
        <input
          className="form-control"
          type="text"
          name="name"
          required
          disabled={disabled}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </div>
      <div className="mt-2">
        <label className="form-label">
          {labels.EMAIL}
          {shouldShowInsertLoginEmailButton && (
            <button
              className="btn btn-outline-dark btn-sm ms-2"
              type="button"
              onClick={insertEmailFromAuth}
            >
              {labels.USE_LOGIN_EMAIL}
            </button>
          )}
        </label>
        <input
          className="form-control"
          type="email"
          name="email"
          disabled={disabled}
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </div>
      <div className="mt-2">
        <label className="form-label">{labels.PHONE_NUMBER}</label>
        <input
          className="form-control"
          type="tel"
          name="phone"
          disabled={disabled}
          defaultValue={existing?.phone_number}
        />
      </div>
      <div className="mt-2">
        <label className="form-label">
          {labels.PHOTO}
          {shouldShowInsertPhotoButton && (
            <button
              className="btn btn-outline-dark btn-sm ms-2"
              type="button"
              onClick={insertPhotoFromAuth}
            >
              {labels.USE_LOGIN_PHOTO}
            </button>
          )}
        </label>
        <div>
          <input
            className="form-control"
            type="file"
            name="Photo"
            accept="image/*"
            multiple={false}
            onChange={onFileInput}
          />
        </div>
      </div>

      <img className="img-fluid border mt-3" src={photoUrl || NO_PHOTO_URL} />

      {error && (
        <div className="text-danger fw-bold mb-3">
          {`${labels.THERE_WAS_AN_UNEXPECTED_ERROR}: ${JSON.stringify(error)}`}
        </div>
      )}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-outline-primary"
          disabled={disabled}
          type="button"
          onClick={onBack}
        >
          {labels.BACK}
        </button>
        <button className="btn btn-primary ms-3" disabled={disabled}>
          {existing ? labels.UPDATE_PROFILE : labels.CREATE_PROFILE}
        </button>
      </div>
    </form>
  );
};

export default ProfilePageCreateForm;
