import { useState } from "react";
import { labels } from "../labels";

const ProfilePageCreateForm = ({
  onSubmit,
  onBack,
  disabled,
  error,
  existing,
  currentUser,
}) => {
  const _onSubmit = async (e) => {
    e.preventDefault();

    onSubmit({
      name: e.target.name.value,
      email: e.target.email.value || null,
      phone_number: e.target.phone.value || null,
    });
  };

  const insertLoginName = () => {
    setName(currentUser.displayName);
  };

  const insertLoginEmail = () => {
    setEmail(currentUser.email);
  };

  const [name, setName] = useState(existing?.name);
  const [email, setEmail] = useState(existing?.email);

  const shouldShowInsertLoginEmailButton =
    currentUser?.email && email !== currentUser.email;

  const shouldShowInsertNameButton =
    currentUser?.displayName && name !== currentUser?.displayName;

  console.log(currentUser);

  return (
    <form onSubmit={_onSubmit}>
      <div className="mt-2">
        <label className="form-label">
          {labels.NAME}
          {shouldShowInsertNameButton && (
            <button
              className="btn btn-outline-dark btn-sm ms-2"
              type="button"
              onClick={insertLoginName}
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
              onClick={insertLoginEmail}
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
