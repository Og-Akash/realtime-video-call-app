import "./navbar.css"
import {useFirebase} from "@/context/Firebase.jsx";
import {useNavigate} from "react-router-dom";

export function Navbar() {
    const firebase = useFirebase()
    const navigate = useNavigate();
    return (
        <div className="navbar-container">
            <h1>Video-Caller</h1>
            {
                !firebase?.currentUser ? (
                    <button onClick={() => navigate("/login")} className="login-btn">Login</button>
                ) : (
                    <div className="profile-container">
                        <img className="profileImage" src={firebase?.currentUser?.photoURL} alt="profile-image"/>
                        <button onClick={() => firebase.handleSignOut()} className="logout-btn">Logout</button>
                    </div>
                )
            }

        </div>
    )
}