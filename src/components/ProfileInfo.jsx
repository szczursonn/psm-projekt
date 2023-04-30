import { labels } from "../labels";
import { NO_PHOTO_URL } from "../consts";

const ProfileInfo = (
  { name, email, phoneNumber, photoUrl, showNull } = { showNull: false }
) => {
  return (
    <div className="d-flex">
      <div className="me-3">
        <img
          className="border rounded mt-3"
          src={photoUrl || NO_PHOTO_URL}
          height={100}
        />
      </div>
      <div>
        <h3 className="mt-3">{name}</h3>
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
    </div>
  );
};

export default ProfileInfo;
