import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseApp } from "../firebase";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS, SITE_TITLE } from "../consts";
import { labels } from "../labels";
import { useEffect, useState } from "react";
import { useChatNotifications } from "../hooks/useChatNotifications";

const Navbar = () => {
  const [dropdownOpened, setDropdownOpened] = useState(false);

  const [user, userLoading] = useAuthState(getAuth(firebaseApp));

  const navigate = useNavigate();
  const location = useLocation();

  const goHome = () => {
    navigate("/");
    setDropdownOpened(false);
  };

  const goToChats = () => {
    navigate(`/${PATHS.CHATS}`);
    setDropdownOpened(false);
  };

  const goToCreateOffer = () => {
    navigate(`/${PATHS.OFFER_CREATE}`);
    setDropdownOpened(false);
  };

  const goToProfile = () => {
    navigate(`/${PATHS.PROFILE}`);
    setDropdownOpened(false);
  };

  const logout = () => {
    signOut(getAuth(firebaseApp));
    setDropdownOpened(false);
  };

  const [unreadMessagesAmount, clearUnreadMessages] = useChatNotifications();

  const currentPath = Object.values(PATHS).find((path) =>
    location.pathname.substring(1).startsWith(path)
  );
  const navbarLabel = labels.PATHS[currentPath];

  useEffect(() => {
    document.title = `${SITE_TITLE}${navbarLabel ? ` | ${navbarLabel}` : ""}`;
    if (currentPath === PATHS.CHATS) {
      clearUnreadMessages();
    }
  }, [currentPath]);

  useEffect(() => {
    if (currentPath === PATHS.CHATS) {
      clearUnreadMessages();
    } else if (unreadMessagesAmount > 0) {
      navigator.vibrate([400, 200, 400]);
    }
  }, [unreadMessagesAmount]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand" href={undefined} onClick={goHome}>
            <img
              src="/favicon.png"
              alt={SITE_TITLE}
              width="30"
              height="30"
              className="align-text-top me-2"
            ></img>
            {navbarLabel || SITE_TITLE}
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
                    <a
                      className="d-flex align-items-center me-4 position-relative"
                      href={undefined}
                      onClick={goToChats}
                    >
                      <img src="/chat-icon.svg" height="35" />
                      {unreadMessagesAmount > 0 &&
                        currentPath !== PATHS.CHATS && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {unreadMessagesAmount}
                          </span>
                        )}
                    </a>
                    <div className="dropdown">
                      <button
                        className={`btn btn-outline-secondary pe-4 dropdown-toggle${
                          dropdownOpened ? " show" : ""
                        }`}
                        onClick={() => setDropdownOpened(!dropdownOpened)}
                      >
                        <img src="/user-profile-icon.svg" />
                      </button>
                      <ul
                        className={`dropdown-menu${
                          dropdownOpened ? " show" : ""
                        }`}
                        style={{
                          right: 0,
                        }}
                      >
                        <li
                          className="dropdown-item pt-2 pb-2"
                          onClick={goToCreateOffer}
                        >
                          {labels.ADD_OFFER}
                        </li>
                        <li
                          className="dropdown-item  pt-2 pb-2"
                          onClick={goToProfile}
                        >
                          {labels.PROFILE}
                        </li>
                        <li
                          className="dropdown-item  pt-2 pb-2"
                          onClick={logout}
                        >
                          {labels.SIGN_OUT}
                        </li>
                      </ul>
                    </div>
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
