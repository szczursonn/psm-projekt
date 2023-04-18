const Footer = () => {
  return (
    <footer className="py-5 my-5 border-top">
      <div className="d-flex flex-column align-items-center">
        <a
          href="https://github.com/szczursonn/psm-projekt"
          className="d-flex align-items-center mb-3 link-dark text-decoration-none"
        >
          <img width={60} src="/github.png"></img>
        </a>
        <p className="text-muted">Authors: Michał Szczurek, Mateusz Puto</p>
      </div>
    </footer>
  );
};

export default Footer;
