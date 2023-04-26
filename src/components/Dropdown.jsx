import Dropdown from 'react-bootstrap/Dropdown';

function SortOffers() {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Sort Offers
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/price-asc">Price (ascending)</Dropdown.Item>
        <Dropdown.Item href="#/price-desc">Price (descending)</Dropdown.Item>
        <Dropdown.Item href="#/year-asc">Year (ascending)</Dropdown.Item>
        <Dropdown.Item href="#/year-desc">Year (descending)</Dropdown.Item>
        <Dropdown.Item href="#/mile-asc">Mileage (ascending)</Dropdown.Item>
        <Dropdown.Item href="#/mile-desc">Mileage (descending)</Dropdown.Item>

      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SortOffers;