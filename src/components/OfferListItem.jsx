import { formatCurrency, formatDaysAgo, getOfferSubtitle } from "../utils";

const OfferListItem = ({ offer, onClick }) => {
  const subtitle = getOfferSubtitle(offer);

  return (
    <div className="col-lg-2 col-md-4 col-sm-12">
      <div className="card mt-4" onClick={onClick}>
        <img
          src={offer.photo_url || "no-photo.jpg"}
          className="card-img-top"
          style={{
            height: "200px",
            objectFit: "cover",
          }}
        ></img>
        <div className="card-body">
          <h5 className="card-title">
            {offer.manufacturer} {offer.model}
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">{subtitle}</h6>
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="card-subtitle text-danger fw-bold">
              {typeof offer.price === "number"
                ? formatCurrency(offer.price)
                : "Ask for price"}
            </h6>
            {offer.created_at && (
              <h6 className="card-subtitle text-muted">
                {formatDaysAgo(offer.created_at.toDate())}
              </h6>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferListItem;
