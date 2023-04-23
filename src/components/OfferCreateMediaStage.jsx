import { useMemo, useState, useImperativeHandle, forwardRef } from "react";

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
    () => (file ? URL.createObjectURL(file) : "/no-photo.jpg"),
    [file]
  );

  const removePhoto = () => {
    setFile(null);
  };

  return (
    <div className="container-fluid">
      <div>
        <label className="form-label">Upload</label>
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
            Remove
          </button>
        )}
      </div>
      <img className="img-fluid border mt-3" src={photoUrl}></img>
    </div>
  );
});

export default OfferCreateMediaStage;
