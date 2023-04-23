import { formatCurrency } from "../utils";

const OfferListItem = ({ offer, onClick }) => {
  let subtitle = offer.year ?? "";
  if (subtitle) {
    subtitle += " · ";
  }
  if (offer.price !== undefined) {
    subtitle += formatCurrency(offer.price);
  }

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
          <h5 className="card-title">{offer.model}</h5>
          <h6 className="card-subtitle mb2 text-muted">{subtitle}</h6>
        </div>
      </div>
    </div>
  );
};

export default OfferListItem;
