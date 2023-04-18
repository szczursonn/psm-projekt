const OfferListItem = ({ car, onClick }) => {
  let subtitle = car.year ?? "";
  if (subtitle) {
    subtitle += " · ";
  }
  if (car.price !== undefined) {
    subtitle += `${car.price}$`;
  }

  return (
    <div className="col-lg-2 col-md-4 col-sm-12">
      <div className="card mt-4" onClick={onClick}>
        <img
          src="https://ocdn.eu/pulscms-transforms/1/Jsvk9kqTURBXy8yODhiZmI1NTQ3OTZiZmNlOGE2ZjczOTA5YTBmNjUyMS5qcGVnkpUDAMxkzQQAzQJAkwXNBLDNAqTeAAKhMAGhMQA"
          className="card-img-top"
        ></img>
        <div className="card-body">
          <h5 className="card-title">{car.model}</h5>
          <h6 className="card-subtitle mb2 text-muted">{subtitle}</h6>
        </div>
      </div>
    </div>
  );
};

export default OfferListItem;
