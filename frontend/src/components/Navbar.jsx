import React from "react";
import { ShieldCheck, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
        const navigate = useNavigate();
  return (

    <>
      <style>{`
        .nav-root {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          backdrop-filter: blur(14px);
          background: rgba(2,13,26,0.65);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .nav-logo-icon {
          width: 32px;
          height: 32px;
          background: #00e896;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-logo-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 20px;
          color: #00e896;
          letter-spacing: -0.5px;
        }

        /* Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-link {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .nav-link:hover {
          color: #fff;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 0%;
          height: 2px;
          background: #00e896;
          transition: width 0.25s;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        /* Actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-login {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-login:hover {
          border-color: rgba(255,255,255,0.2);
          color: #fff;
        }

        .nav-cta {
          background: #00e896;
          color: #020d1a;
          border: none;
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 18px rgba(0,232,150,0.3);
        }

        .nav-cta:hover {
          background: #00ffa3;
          box-shadow: 0 6px 24px rgba(0,232,150,0.5);
          transform: translateY(-1px);
        }

        /* Mobile */
        .nav-menu {
          display: none;
          color: white;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .nav-actions {
            display: none;
          }
          .nav-menu {
            display: block;
          }
        }
      `}</style>

      <nav className="nav-root">
        <div className="nav-container">
          
          {/* Logo */}
          <div className="nav-logo">
            <div className="nav-logo-icon">
              <ShieldCheck size={18} color="#020d1a" />
            </div>
            <span className="nav-logo-name">RozgaarX</span>
          </div>

          {/* Links */}
          <div className="nav-links">
            <span className="nav-link">Jobs</span>
            <span className="nav-link">Companies</span>
            <span className="nav-link">About</span>
            <span className="nav-link">Contact</span>
          </div>

          {/* Actions */}
          <div className="nav-actions">
            <button className="nav-login"
              onClick={() => navigate("/login")}>Login</button>
            <button className="nav-cta"
              onClick={() => navigate("/register")}>Get Started</button>
          </div>

          {/* Mobile Menu */}
          <div className="nav-menu">
            <Menu size={22} />
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;