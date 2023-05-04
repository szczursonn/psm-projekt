import { labels } from "../labels";
import { NO_PHOTO_URL } from "../consts";

const ProfileInfo = (
  { name, email, phoneNumber, photoUrl, showNull } = { showNull: false }
) => {
  return (
    <div>
      <div className="d-flex align-items-center">
        <img
          className="border rounded"
          src={photoUrl || NO_PHOTO_URL}
          height={100}
        />
        <h2 className="ms-3">{name}</h2>
      </div>

      {(email || showNull) && (
        <div className="d-flex align-items-center mt-2">
          <img src="/mail-icon.svg" height={20} className="me-2" />
          {email || labels.NOT_SET}
        </div>
      )}
      {(phoneNumber || showNull) && (
        <div className="d-flex align-items-center mt-2">
          <img src="/phone-icon.svg" height={20} className="me-2" />
          {phoneNumber || labels.NOT_SET}
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
