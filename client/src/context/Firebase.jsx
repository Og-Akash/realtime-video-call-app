import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { auth } from "@/firebase/index.js";
// import { useNavigate } from "react-router-dom";

export const firebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
    const googleProvider = new GoogleAuthProvider();
    // const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    const signinWithGooglePopup = useCallback(
        async (options) => {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                if (result.user) {
                    if (options?.redirectTo) {
                        console.log("redirectTo", options.redirectTo);
                    }
                }
                return result;
            } catch (error) {
                console.error("Error during sign-in:", error);
                throw error;
            }
        },
        []
    );

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);


    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null);
        } catch (error) {
            console.error("Error during sign-out:", error);
        }
    };

    return (
        <firebaseContext.Provider
            value={{
                signinWithGooglePopup,
                handleSignOut,
                currentUser,
            }}
        >
            {children}
        </firebaseContext.Provider>
    );
}

export function useFirebase() {
    const context = useContext(firebaseContext);
    if (!context) {
        throw new Error("useFirebase must be used within a FirebaseProvider!");
    }
    return context;
}

