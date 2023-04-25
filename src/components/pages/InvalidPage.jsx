import { labels } from "../../labels";

const InvalidPage = () => {
  return (
    <div className="container-fluid text-center mt-5">
      <h1>404</h1>
      <h4>{labels.THIS_PAGE_DOES_NOT_EXIST}</h4>
    </div>
  );
};

export default InvalidPage;
