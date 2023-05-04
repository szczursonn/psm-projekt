import { useState } from "react";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { labels } from "../../labels";
import { doc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const authErrors = {
  "auth/user-not-found": labels.AUTH_ERRORS.USER_NOT_FOUND,
  "auth/wrong-password": labels.AUTH_ERRORS.WRONG_PASSWORD,
  "auth/popup-closed-by-user": labels.AUTH_ERRORS.SIGN_IN_CANCELLED,
  "auth/email-already-in-use": labels.AUTH_ERRORS.EMAIL_IN_USE,
  "auth/weak-password": labels.AUTH_ERRORS.WEAK_PASSWORD,
  "auth/invalid-email": labels.AUTH_ERRORS.INVALID_EMAIL,
};

const MODE = {
  LOGIN: 0,
  REGISTER: 1,
};

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(MODE.LOGIN);

  const navigate = useNavigate();

  const signInWrapper = async (fn) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await fn();
      navigate(-1);
    } catch (err) {
      setError(err);
      console.error(err);
    }
    setLoading(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (mode === MODE.LOGIN) {
      signInWrapper(() =>
        signInWithEmailAndPassword(getAuth(firebaseApp), email, password)
      );
    } else {
      signInWrapper(() =>
        createUserWithEmailAndPassword(getAuth(firebaseApp), email, password)
      );
    }
  };

  const signInWithGoogle = () => {
    signInWrapper(() =>
      signInWithPopup(getAuth(firebaseApp), new GoogleAuthProvider())
    );
  };

  return (
    <div className="container-fluid mt-5">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">{labels.EMAIL}</label>
          <input
            className="form-control"
            name="email"
            type="email"
            disabled={loading}
            required
          ></input>
        </div>
        <div className="mb-3">
          <label className="form-label">{labels.PASSWORD}</label>
          <input
            className="form-control"
            name="password"
            type="password"
            required
            disabled={loading}
          ></input>
        </div>
        {mode === MODE.LOGIN ? (
          <p>
            {labels.AUTH_HINT_TO_REGISTER}{" "}
            <a href="#" onClick={() => setMode(MODE.REGISTER)}>
              {labels.REGISTER_HERE}
            </a>
          </p>
        ) : (
          <p>
            {labels.AUTH_HINT_TO_LOGIN}{" "}
            <a href="#" onClick={() => setMode(MODE.LOGIN)}>
              {labels.LOG_IN_INSTEAD}
            </a>
          </p>
        )}
        {error && (
          <div className="text-danger fw-bold mb-3">
            {authErrors[error?.code] ||
              `${labels.THERE_WAS_AN_UNEXPECTED_ERROR}: ${JSON.stringify(
                error
              )}`}
          </div>
        )}
        {mode === MODE.LOGIN && (
          <button type="submit" disabled={loading} className="btn btn-primary">
            {labels.LOG_IN}
          </button>
        )}

        {mode === MODE.REGISTER && (
          <button type="submit" disabled={loading} className="btn btn-primary">
            {labels.REGISTER}
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          className="btn btn-outline-success ms-2"
          onClick={signInWithGoogle}
        >
          <img src="/google.svg" height={20} className="me-2"></img>
          {labels.LOG_IN_WITH_GOOGLE}
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
