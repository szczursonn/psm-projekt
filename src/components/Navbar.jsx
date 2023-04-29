import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseApp } from "../firebase";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS, SITE_TITLE } from "../consts";
import { labels } from "../labels";

const Navbar = () => {
  const [user, userLoading] = useAuthState(getAuth(firebaseApp));

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    signOut(getAuth(firebaseApp));
  };

  const navbarLabel =
    labels.PATHS[
      Object.values(PATHS).find((path) =>
        location.pathname.substring(1).startsWith(path)
      )
    ] || SITE_TITLE;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={() => navigate("/")}>
            <img
              src="/favicon.png"
              alt={SITE_TITLE}
              width="30"
              height="30"
              className="align-text-top me-2"
            ></img>
            {navbarLabel}
          </a>
          <div className="d-flex">
            {userLoading ? (
              <div className="me-3">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {user ? (
                  <>
                    <button
                      className="btn btn-outline-success me-2"
                      onClick={() => navigate(`/${PATHS.OFFER_CREATE}`)}
                    >
                      {labels.ADD_OFFER}
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={logout}
                    >
                      {labels.SIGN_OUT}
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate(`/${PATHS.SIGN_IN}`)}
                  >
                    {labels.SIGN_IN}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
