import { useMemo, useState, useImperativeHandle, forwardRef } from "react";
import { labels } from "../labels";
import { NO_PHOTO_URL } from "../consts";

const OfferCreateMediaStage = forwardRef(({ offerToCreate }, ref) => {
  const [file, setFile] = useState(offerToCreate?.file || null);

  useImperativeHandle(ref, () => ({
    getData() {
      return { file };
    },
  }));

  const onFileInput = (e) => {
    const file = e.target?.files?.[0];
    setFile(file || null);
  };

  const photoUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : NO_PHOTO_URL),
    [file]
  );

  const removePhoto = () => {
    setFile(null);
  };

  return (
    <div className="container-fluid">
      <div>
        <input
          className="form-control"
          type="file"
          name="Photo"
          accept="image/*"
          multiple={false}
          onChange={onFileInput}
        />
        {file && (
          <button className="btn btn-danger mt-1" onClick={removePhoto}>
            {labels.REMOVE}
          </button>
        )}
      </div>
      <img className="img-fluid border mt-3" src={photoUrl}></img>
    </div>
  );
});

export default OfferCreateMediaStage;
