import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/Socket.jsx";
import { ACTIONS } from "@/actions.js";
import { usePeer } from "@/hooks/usePeer";
import { usePlayers } from "@/hooks/usePlayers.jsx";
import { useMediaStream } from "@/hooks/useMediaStream.jsx";
import { useAvailableDevices } from "@/hooks/useMediaDevices.jsx";
import MeetingRoom from "@/components/meeting/Meeting.jsx";
import { cloneDeep } from "lodash";
import Loader from "../components/Loader";
import { useLocation } from "react-router-dom";

const Conference = () => {
  const { socket } = useSocket();
  const { peer, myId } = usePeer();
  const { players, setPlayers, highlightedPlayer, nonHighlightedPlayers } =
    usePlayers(myId, peer);
  const [calls, setCalls] = useState({}); // Track ongoing calls
  const { videoDevices } = useAvailableDevices();
  const { state } = useLocation();
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const { stream, updateStream } = useMediaStream(selectedDeviceId); // Modified hook to support stream updates
  const [isLoading, setIsLoading] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    if (state?.deviceId) {
      setSelectedDeviceId(state.deviceId);
    } else if (videoDevices.length > 0) {
      setSelectedDeviceId(videoDevices[0].deviceId);
    }
  }, [state, videoDevices]);

  //? show the loader if until the peer connection is established
  useEffect(() => {
    if (!peer) {
      return;
    }

    const handlePeerReady = () => {
      console.log("peer connection established");
      setIsLoading(false);
    };

    peer.on("open", handlePeerReady);

    peer.on("error", () => console.log("error while connecting"));

    return () => peer.off("open", handlePeerReady);
  }, [peer]);

  // Handle new user joining
  useEffect(() => {
    if (!socket || !peer) return;

    const handleNewUserJoin = ({ user, peerId, connectedUsers }) => {
      if (peerId === myId) return; // Skip self
      console.log("New user joined:", { user, connectedUsers });

      setConnectedUsers(() => [...connectedUsers]);
      // Call the new user
      if (!calls[peerId]) {
        const callInstance = peer.call(peerId, stream);
        setCalls((prev) => ({ ...prev, [peerId]: callInstance }));

        callInstance.on("stream", (remoteStream) => {
          setPlayers((prev) => ({
            ...prev,
            [peerId]: {
              stream: remoteStream,
              muted: false,
              playing: true,
            },
          }));
        });

        callInstance.on("close", () => {
          // console.log(`Call with ${peerId} closed`);
          setCalls((prev) => {
            const updatedCalls = { ...prev };
            delete updatedCalls[peerId];
            return updatedCalls;
          });

          setPlayers((prev) => {
            const updatedPlayers = { ...prev };
            delete updatedPlayers[peerId];
            return updatedPlayers;
          });
        });

        callInstance.on("error", (err) => console.error("Call error:", err));
      }
    };

    // socket.on(ACTIONS.JOINED, handleRoomUsers);
    socket.on(ACTIONS.USER_JOINED, handleNewUserJoin);

    return () => {
      // socket.off(ACTIONS.ROOM_USERS, handleRoomUsers);
      socket.off(ACTIONS.USER_JOINED, handleNewUserJoin);
    };
  }, [peer, stream, socket, myId, calls]);

  //? Handle incoming calls
  useEffect(() => {
    if (!peer) return;

    peer.on("call", (call) => {
      const { peer: callerId } = call;
      // console.log("call instace", call);

      call.answer(stream);

      setCalls((prev) => ({ ...prev, [callerId]: call }));

      call.on("stream", (remoteStream) => {
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            stream: remoteStream,
            muted: false,
            playing: true,
          },
        }));
      });

      call.on("close", () => {
        // console.log(`Call with ${callerId} closed`);
        setCalls((prev) => {
          const updatedCalls = { ...prev };
          delete updatedCalls[callerId];
          return updatedCalls;
        });

        setPlayers((prev) => {
          const updatedPlayers = { ...prev };
          delete updatedPlayers[callerId];
          return updatedPlayers;
        });
      });

      call.on("error", (err) => {
        console.error("Incoming call error:", err);
      });
    });

    return () => {
      peer.off("call");
    };
  }, [peer, stream, myId, players, setPlayers]);

  //? Add local user to players
  useEffect(() => {
    if (!myId || !stream || !setPlayers) return;

    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        stream: stream, // Stream will be added once initialized
        muted: true, // Local video muted
        playing: true,
      },
    }));
  }, [myId, stream, setPlayers]);

  //? event to check the user toggle his mic, video & leave the room
  useEffect(() => {
    if (!socket) return;

    function toggleMic(userId) {
      // console.log(`User toggled their mic: ${userId}`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return copy;
      });
    }

    function toggleVideo(userId) {
      // console.log(`User toggled their video: ${userId}`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return copy;
      });
    }

    function toggleLeave({ email, connectedUsers, userId }) {
      console.log(`${email} leave the room.`);
      console.log("fresh users", connectedUsers);

      alert(`user with id ${email} leave the room`);
      const updatedPlayer = cloneDeep(players);
      delete updatedPlayer[userId];
      setPlayers(updatedPlayer);
      setConnectedUsers([...connectedUsers]);
    }

    socket.on(ACTIONS.USER_TOOGLE_AUDIO, toggleMic);
    socket.on(ACTIONS.USER_TOOGLE_VIDEO, toggleVideo);
    socket.on(ACTIONS.USER_LEAVE, toggleLeave);

    return () => {
      socket.off(ACTIONS.USER_TOOGLE_AUDIO, toggleMic);
      socket.off(ACTIONS.USER_TOOGLE_VIDEO, toggleVideo);
      socket.on(ACTIONS.USER_LEAVE, toggleLeave);
    };
  }, [socket]);


  if (isLoading) {
    return <Loader>Joining The Room...</Loader>;
  }

  return (
    <div>
      <MeetingRoom
        connectedUsers={connectedUsers}
        calls={calls}
        myId={myId}
        players={players}
        highlightedPlayer={highlightedPlayer}
        nonHighlightedPlayers={nonHighlightedPlayers}
        setPlayers={setPlayers}
      />
    </div>
  );
};

export default Conference;
