import React, { useMemo } from "react";
import { Video } from "lucide-react";
import { Link } from "react-router-dom";
import "./footer.css"; // Import the CSS file

export function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo */}
          <Link to="/" className="footer-logo">
          <img onClick={() => navigate("/")} src="./logo.png" width={120} height={40}/>
          </Link>

          {/* Copyright */}
          <div className="footer-text">
            <p>© {currentYear} ZENO. All rights reserved.</p>
            <p className="footer-subtext">
              Connecting people beyond boundaries.
            </p>
          </div>

          {/* Links */}
          <div className="footer-links">
            <Link to="/" className="footer-link">
              Home
            </Link>
            <Link to="/rooms" className="footer-link">
              Rooms
            </Link>
            <Link to="/terms" className="footer-link">
              Profile
            </Link>
            <Link to="/contact" className="footer-link">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
