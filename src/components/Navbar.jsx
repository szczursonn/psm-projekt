import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseApp } from "../firebase";
import LoadingSpinner from "./LoadingSpinner";

const Navbar = ({ onHomeClick, onSignInClick, onAddOfferClick }) => {
  const [user, userLoading] = useAuthState(getAuth(firebaseApp));

  const logout = () => {
    signOut(getAuth(firebaseApp));
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={onHomeClick}>
            <img
              src="/favicon.png"
              alt=""
              width="30"
              height="30"
              className="align-text-top me-2"
            ></img>
            Otomoto v2
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
                      onClick={onAddOfferClick}
                    >
                      Add offer
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={logout}
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-outline-primary"
                    onClick={onSignInClick}
                  >
                    Sign in
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
