import "./navbar.css";
import { useFirebase } from "@/context/Firebase.jsx";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, User2, Video } from "lucide-react";

export function Navbar() {
  const firebase = useFirebase();
  const navigate = useNavigate();

  return (
    <nav className="glass-effect navbar">
      <div className="navbar-container">
        {/* Logo */}

        <div className="logo-box">
          {/* <div className="logo">
            <Video className="logo-icon" />
          </div> */}
        <img onClick={() => navigate("/")} src="./logo.png" width={160} height={60}/>
        </div>
        {!firebase?.currentUser ? (
          <button
            onClick={() => navigate("/login")}
            className="auth-btn login-btn"
          >
            <LogIn />
            Login
          </button>
        ) : (
          <div className="profile-container">
            <span className="user-details">
              <User2 /> {firebase?.currentUser?.displayName}
            </span>
            <button
              onClick={() => firebase.handleSignOut()}
              className="auth-btn logout-btn"
            >
              <LogOut />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
