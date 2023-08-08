import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container text-center">
        <span className="text-muted">
          © {currentYear} Social Cafe - Coded by
          <a
            href="https://www.linkedin.com/in/ferhatakalan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            {" "}
            Ferhat Akalan
          </a>{" "}
          <a
            href="https://github.com/FerhatAkalan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            {" "}
            <i class="fa-brands fa-github me-1"></i>GitHub
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
