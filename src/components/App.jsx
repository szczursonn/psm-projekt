import { useState } from "react";
import OfferList from "./OfferList";
import Navbar from "./Navbar";
import OfferDetails from "./OfferDetails";
import SignInModal from "./SignInModal";
import OfferCreateForm from "./OfferCreateForm";
import Footer from "./Footer";

const App = () => {
  const [signInModalVisible, setSignInModalVisible] = useState(false);
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  const goToOffer = (offerId) => {
    setIsAddingOffer(false);
    setSelectedOfferId(offerId);
  };

  const goHome = () => {
    setIsAddingOffer(false);
    setSelectedOfferId(null);
  };

  return (
    <>
      {signInModalVisible && (
        <SignInModal
          visible={signInModalVisible}
          close={() => setSignInModalVisible(false)}
        />
      )}
      <Navbar
        onHomeClick={goHome}
        onSignInClick={() => setSignInModalVisible(true)}
        onAddOfferClick={() => setIsAddingOffer(true)}
      />
      {isAddingOffer ? (
        <OfferCreateForm goToOffer={goToOffer} />
      ) : (
        <>
          {selectedOfferId ? (
            <OfferDetails carId={selectedOfferId} />
          ) : (
            <OfferList onOfferClick={goToOffer} />
          )}
        </>
      )}
      <Footer />
    </>
  );
};

export default App;
