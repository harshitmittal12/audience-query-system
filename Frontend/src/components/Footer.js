import React from 'react';

function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <div className="container text-center">
        <span className="text-muted">
          © {new Date().getFullYear()} Query Management System.
          <br />
          <small>Hackathon Project</small>
        </span>
        <div className="mt-2">
          <a 
            href="https://www.linkedin.com/in/harshit-mittal-470a95246" // <-- FIXED: Added https://
            target="_blank" 
            rel="noopener noreferrer" 
            className="mx-1 footer-icon footer-icon-linkedin" // <-- FIXED: Icons closer
            aria-label="LinkedIn Profile"
          >
            <i className="bi bi-linkedin"></i>
          </a>
          <a 
            href="https://github.com/harshitmittal12/audience-query-system"
            target="_blank" 
            rel="noopener noreferrer" 
            className="mx-1 footer-icon footer-icon-github" // <-- FIXED: Icons closer
            aria-label="GitHub Profile"
          >
            <i className="bi bi-github"></i>
          </a>
        </div>
        <div className="mt-2">
          <small className="text-muted">
            Designed & Developed by Harshit Mittal
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;