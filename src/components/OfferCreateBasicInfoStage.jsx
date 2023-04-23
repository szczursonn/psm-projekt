import { forwardRef, useImperativeHandle, useRef } from "react";

const OfferCreateBasicInfoStage = forwardRef(({ offerToCreate }, ref) => {
  useImperativeHandle(ref, () => ({
    getData() {
      const form = formRef.current;
      if (!form || !form.reportValidity()) {
        return null;
      }
      return {
        manufacturer: form.manufacturer.value,
        model: form.model.value,
        year: form.year.value,
        price: form.price.value,
        miles: form.miles.value,
      };
    },
  }));

  const formRef = useRef();

  return (
    <form ref={formRef}>
      <div className="mb-3">
        <label className="form-label">Manufacturer</label>
        <input
          className="form-control"
          name="manufacturer"
          type="text"
          required
          defaultValue={offerToCreate.manufacturer}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">Model</label>
        <input
          className="form-control"
          name="model"
          type="text"
          required
          defaultValue={offerToCreate.model}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">Year</label>
        <input
          className="form-control"
          name="year"
          type="number"
          defaultValue={offerToCreate.year}
          min={1900}
          max={new Date().getFullYear()}
          step={1}
          required
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          className="form-control"
          name="price"
          type="number"
          required
          defaultValue={offerToCreate.price}
          min={0}
          step={1}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">Miles</label>
        <input
          className="form-control"
          name="miles"
          type="number"
          min={0}
          step={1}
          defaultValue={offerToCreate.miles}
        ></input>
      </div>
    </form>
  );
});

export default OfferCreateBasicInfoStage;
