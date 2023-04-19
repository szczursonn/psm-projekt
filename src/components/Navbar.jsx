import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseApp } from "../firebase";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, userLoading] = useAuthState(getAuth(firebaseApp));

  const navigate = useNavigate();

  const logout = () => {
    signOut(getAuth(firebaseApp));
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={() => navigate("/")}>
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
                      onClick={() => navigate("/offer-create")}
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
                    onClick={() => navigate("/sign-in")}
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
