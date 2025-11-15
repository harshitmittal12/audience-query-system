import React from 'react';

function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <div className="container text-center">
        
        {/* --- Copyright & Hackathon Info --- */}
        <span className="text-muted">
          © {new Date().getFullYear()} Query Management System.
          <br />
          <small>Hackathon Project</small>
        </span>
        
        {/* --- Social Icons --- */}
        <div className="mt-2">
          {/* LinkedIn Icon Link */}
          <a 
            href="www.linkedin.com/in/harshit-mittal-470a95246"  // <-- REPLACE THIS
            target="_blank" 
            rel="noopener noreferrer" 
            className="mx-2 footer-icon footer-icon-linkedin"
            aria-label="LinkedIn Profile"
          >
            <i className="bi bi-linkedin"></i>
          </a>
          
          {/* GitHub Icon Link */}
          <a 
            href="https://github.com/harshitmittal12/audience-query-system" // <-- REPLACE THIS
            target="_blank" 
            rel="noopener noreferrer" 
            className="mx-2 footer-icon footer-icon-github"
            aria-label="GitHub Profile"
          >
            <i className="bi bi-github"></i>
          </a>
        </div>

        {/* --- Designed By Line (Centered) --- */}
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