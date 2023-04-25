import LoadingSpinner from "./LoadingSpinner";

const FullPageLoadingSpinner = ({ children }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ marginTop: "250px", marginBottom: "250px" }}
    >
      <LoadingSpinner />
      {children}
    </div>
  );
};

export default FullPageLoadingSpinner;
