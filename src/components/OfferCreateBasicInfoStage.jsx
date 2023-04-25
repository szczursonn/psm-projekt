import { forwardRef, useImperativeHandle, useRef } from "react";
import { labels } from "../labels";
import { FUEL_TYPE_TO_LABEL } from "../utils";

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
        horses: form.horses.value,
        fuelType: form.fuelType.value,
      };
    },
  }));

  const formRef = useRef();

  return (
    <form ref={formRef}>
      <div className="mb-3">
        <label className="form-label">{labels.MANUFACTURER}</label>
        <input
          className="form-control"
          name="manufacturer"
          type="text"
          required
          defaultValue={offerToCreate.manufacturer}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">{labels.MODEL}</label>
        <input
          className="form-control"
          name="model"
          type="text"
          required
          defaultValue={offerToCreate.model}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">{labels.PRODUCTION_YEAR}</label>
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
        <label className="form-label">{labels.PRICE}</label>
        <input
          className="form-control"
          name="price"
          type="number"
          defaultValue={offerToCreate.price}
          min={0}
          step={1}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">{labels.MILEAGE}</label>
        <input
          className="form-control"
          name="miles"
          type="number"
          min={0}
          step={1}
          defaultValue={offerToCreate.miles}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">{labels.HORSEPOWER}</label>
        <input
          className="form-control"
          name="horses"
          type="number"
          min={0}
          step={1}
          defaultValue={offerToCreate.horses}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">{labels.FUEL_TYPE}</label>
        <select
          className="form-select"
          name="fuelType"
          defaultValue={offerToCreate.fuelType}
        >
          <option>{labels.SELECT_FUEL_TYPE}</option>
          {["petrol", "diesel", "lpg", "hybrid", "electric"].map((fuelType) => (
            <option value={fuelType} key={fuelType}>
              {FUEL_TYPE_TO_LABEL[fuelType]}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
});

export default OfferCreateBasicInfoStage;
