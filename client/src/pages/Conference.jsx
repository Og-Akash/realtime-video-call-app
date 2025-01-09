import React, { useCallback, useEffect } from "react";
import { useSocket } from "../context/Socket";
import { ACTIONS } from "../actions";
import { useParams } from "react-router-dom";
import { usePeer } from "../context/Peer";

const Conference = () => {
  const { socket } = useSocket();
  const { id } = useParams();
  const { peer, createOffer } = usePeer();

  const handleNewUserJoined = useCallback(async (data) => {
    console.log("user Joined room", data.email);
    const offer = await createOffer();
    socket.emit(ACTIONS.CALL_USER, { email: data.email, offer });
  },[createOffer,socket]);

  const handleIncomingCall = useCallback((data) => {
    console.log("incoming call", data)
  })

  useEffect(() => {
    socket.on(ACTIONS.USER_JOINED, handleNewUserJoined);
    socket.on(ACTIONS.INCOMING_CALL, handleIncomingCall);
    // Cleanup to prevent duplicate listeners
    return () => {
      socket.off(ACTIONS.USER_JOINED, handleNewUserJoined);
      socket.off(ACTIONS.INCOMING_CALL, handleIncomingCall);
    };
  }, [socket]);

  return (
    <div>
      <h1>All guys meet here Room {id}</h1>
    </div>
  );
};

export default Conference;
