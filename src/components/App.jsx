import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { PATHS } from "../consts";
import Navbar from "./Navbar";
import FullPageLoadingSpinner from "./FullPageLoadingSpinner";

const OfferListPage = React.lazy(() => import("./pages/OfferListPage"));
const SignInPage = React.lazy(() => import("./pages/SignInPage"));
const OfferDetailsPage = React.lazy(() => import("./pages/OfferDetailsPage"));
const OfferCreatePage = React.lazy(() => import("./pages/OfferCreatePage"));
const ChatPage = React.lazy(() => import("./pages/Chat"));
const InvalidPage = React.lazy(() => import("./pages/InvalidPage"));

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
        <Route path={PATHS.CHATS} element={<ChatPage />} />
        <Route path="*" element={<InvalidPage />} />
      </Route>
    </Routes>
  );
};

const Layout = () => {
  return (
    <>
      <Navbar />
      <React.Suspense fallback={<FullPageLoadingSpinner />}>
        <Outlet />
      </React.Suspense>
    </>
  );
};

export default App;
