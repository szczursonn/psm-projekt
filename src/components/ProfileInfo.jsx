import { labels } from "../labels";

const ProfileInfo = (
  { name, email, phoneNumber, showNull } = { showNull: false }
) => {
  return (
    <div className="container-fluid">
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
  );
};

export default ProfileInfo;
