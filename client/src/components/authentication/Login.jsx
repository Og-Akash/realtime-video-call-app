import React, {useContext, useEffect} from 'react'
import "./login.css"
import {useFirebase} from "@/context/Firebase.jsx";
import {useNavigate} from "react-router-dom";

export default function Login(){
    const navigate = useNavigate()
    const firebase = useFirebase()

    const handleSignIn = async () => {
        try{
            await firebase.signinWithGooglePopup({redirectTo: "/create-room"})
            console.log("User signed in successfully!");
        }catch (e){
            console.log("Error during login with GooglePopup!", e);
        }
    }

    useEffect(() => {
            if (firebase.currentUser !== null) {
                navigate("/create-room")
            }
        },
        [firebase.currentUser]);

    return (
        <div className="mididle-screen">
            <h1 className="heading">Continue With Google</h1>
           <div onClick={handleSignIn} className="login-button">
               <img className="social-icon" src="/google.png" alt="google-logo" />
                   <span>Login with Google</span>
           </div>
        </div>
    )
}