import Navbar from "./Navbar";
import { Outlet, Route, Routes } from "react-router-dom";
import OfferListPage from "./pages/OfferListPage";
import OfferDetailsPage from "./pages/OfferDetailsPage";
import SignInPage from "./pages/SignInPage";
import { PATHS } from "../consts";
import OfferCreatePage from "./pages/OfferCreatePage";
import ViewChat from "./pages/Chat";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<OfferListPage />} />
        <Route path={PATHS.SIGN_IN} element={<SignInPage />} />
        <Route
          path={`${PATHS.OFFER_DETAILS}/:offerId`}
          element={<OfferDetailsPage />}
        />
        <Route path={PATHS.OFFER_CREATE} element={<OfferCreatePage />} />
        <Route path={PATHS.CHATS} element={<ViewChat />} />
      </Route>
    </Routes>
  );
};

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default App;
