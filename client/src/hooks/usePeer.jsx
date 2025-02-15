import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { useSocket } from "@/context/Socket.jsx";
import { ACTIONS } from "@/actions.js";
import { useLocation, useParams } from "react-router-dom";

export function usePeer() {
    const [myId, setMyId] = useState("");
    const peerRef = useRef(null); // Persistent reference to Peer instance
    const { socket } = useSocket();
    const { roomId } = useParams();
    const location = useLocation();
    const { user } = location.state || {};

    useEffect(() => {
        if (peerRef.current) return; // Prevent multiple PeerJS instances

        // Create Peer instance
       const peerInstance = new Peer({
            config: {
                iceServers: [
                    { url: "stun:stun.l.google.com:19302" },
                    { url: "stun:global.stun.twilio.com:3478" },
                ],
            },
        });

        peerRef.current = peerInstance;

        peerInstance.on("open", (id) => {
            console.log("Peer ID: ", id);
            setMyId(id);

            //* Notify backend that new user is joined
            if (socket) {
                socket.emit(ACTIONS.JOIN, {
                    roomId,
                    peerId: id,
                    user,
                });
            }
        });

        peerInstance.on("error", (err) => {
            console.error("Peer error:", err);
        });

        // Cleanup Peer instance on unmount
        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }
        };
    }, [socket, roomId, user]); // Minimal dependencies to avoid unnecessary reinitialization

    return {
        peer: peerRef.current,
        myId,
    };
}
