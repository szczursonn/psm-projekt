import { useState, forwardRef, useImperativeHandle } from "react";

const OfferCreateFeaturesStage = forwardRef(({ offerToCreate }, ref) => {
  const [features, setFeatures] = useState(offerToCreate?.features || []);

  useImperativeHandle(ref, () => ({
    getData() {
      return {
        features,
      };
    },
  }));

  const onFeatureAdd = (e) => {
    e.preventDefault();

    const feature = e.target.feature.value.trim();
    if (!features.includes(feature)) {
      setFeatures([...features, feature]);
      e.target.reset();
    }
  };

  const onFeatureDelete = (feature) => {
    const newFeatures = [...features];
    const featureToDeleteIndex = newFeatures.findIndex((f) => f === feature);
    if (featureToDeleteIndex !== -1) {
      newFeatures.splice(featureToDeleteIndex, 1);
    }
    setFeatures(newFeatures);
  };

  return (
    <div>
      <div className="list-group">
        {features.map((feature) => (
          <a
            className="list-group-item list-group-item-action"
            key={feature}
            onClick={() => onFeatureDelete(feature)}
          >
            {feature}
          </a>
        ))}
        {features.length === 0 && (
          <p className="list-group-item">
            Add features in form below! (heated seats, rear view camera etc.)
          </p>
        )}
      </div>
      <form className="d-flex mt-3" onSubmit={onFeatureAdd}>
        <input
          className="form-control"
          type="text"
          name="feature"
          placeholder="Feature"
          required
        ></input>
        <button className="btn btn-primary ms-3">Add</button>
      </form>
    </div>
  );
});

export default OfferCreateFeaturesStage;
