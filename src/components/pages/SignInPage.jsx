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

const firestoreErrors = {
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Wrong password",
  "auth/popup-closed-by-user": "Sign in was cancelled",
  "auth/email-already-in-use": "Email already in use",
  "auth/weak-password": "Password too weak",
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
          <label className="form-label">Email</label>
          <input
            className="form-control"
            name="email"
            type="email"
            disabled={loading}
            required
          ></input>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
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
            Don't have an account?{" "}
            <a href="#" onClick={() => setMode(MODE.REGISTER)}>
              Register here
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <a href="#" onClick={() => setMode(MODE.LOGIN)}>
              Log in instead
            </a>
          </p>
        )}
        {error && (
          <div className="text-danger fw-bold mb-3">
            {firestoreErrors[error?.code] ||
              `There was an unexpected error: ${JSON.stringify(error)}`}
          </div>
        )}
        {mode === MODE.LOGIN && (
          <button type="submit" disabled={loading} className="btn btn-primary">
            Log In
          </button>
        )}

        {mode === MODE.REGISTER && (
          <button type="submit" disabled={loading} className="btn btn-primary">
            Register
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          className="btn btn-outline-success ms-2"
          onClick={signInWithGoogle}
        >
          <img src="/google.svg" height={20} className="me-2"></img>
          Log In with Google
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
