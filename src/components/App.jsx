import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, Route, Routes } from "react-router-dom";
import OfferListPage from "./pages/OfferListPage";
import OfferDetailsPage from "./pages/OfferDetailsPage"
import SignInPage from "./pages/SignInPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<OfferListPage />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="offers/:offerId" element={<OfferDetailsPage />} />
      </Route>
    </Routes>
  );
};

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default App;
