import { createElement, useState } from "react";
import OfferList from "./pages/OfferListPage";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { NavigationContext } from "../navigation";

const DEFAULT_PAGE = {
  pageFn: OfferList,
  params: {},
};

const App = () => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  const navigate = (pageFn, params = {}) => {
    console.log(`Navigation: ${currentPage.pageFn.name} -> ${pageFn.name}`);
    setCurrentPage({
      pageFn,
      params,
    });
  };

  return (
    <NavigationContext.Provider value={navigate}>
      <Navbar />
      {createElement(currentPage.pageFn, currentPage.params)}
      <Footer />
    </NavigationContext.Provider>
  );
};

export default App;
