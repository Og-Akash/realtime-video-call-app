import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/Socket.jsx";
import { ACTIONS } from "@/actions.js";
import { usePeer } from "@/hooks/usePeer";
import { usePlayers } from "@/hooks/usePlayers.jsx";
import { useMediaStream } from "@/hooks/useMediaStream.jsx";
import { useAvailableDevices } from "@/hooks/useMediaDevices.jsx";
import MeetingRoom from "@/components/meeting/Meeting.jsx";
import { cloneDeep } from "lodash";
import { LoaderCircle } from "lucide-react";

const Conference = () => {
  const { socket } = useSocket();
  const { peer, myId } = usePeer();
  const { players, setPlayers, highlightedPlayer, nonHighlightedPlayers } =
    usePlayers(myId, peer);
  const [calls, setCalls] = useState({}); // Track ongoing calls
  const { videoDevices } = useAvailableDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    videoDevices[0]?.deviceId
  );
  const { stream, updateStream } = useMediaStream(selectedDeviceId); // Modified hook to support stream updates
  const [isLoading, setIsLoading] = useState(true);

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

    const handleNewUserJoin = ({ peerId }) => {
      if (peerId === myId) return; // Skip self

      // Initiate a single call to the new user if not already connected
      if (!calls[peerId]) {
        console.log("stream", stream);
        const callInstance = peer.call(peerId, stream);
        console.log(callInstance);
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
          console.log(`Call with ${peerId} closed`);
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

        callInstance.on("error", (err) => {
          console.error("Call error:", err);
        });
      }
    };

    socket.on(ACTIONS.USER_JOINED, handleNewUserJoin);

    return () => {
      socket.off(ACTIONS.USER_JOINED, handleNewUserJoin);
    };
  }, [peer, stream, socket, myId, players, calls, setPlayers]);

  //? Handle incoming calls
  useEffect(() => {
    if (!peer) return;

    peer.on("call", (call) => {
      const { peer: callerId } = call;

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
        console.log(`Call with ${callerId} closed`);
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
        stream: null, // Stream will be added once initialized
        muted: false, // Local video muted
        playing: true,
      },
    }));
  }, [myId, stream, setPlayers]);

  //? event to check the user toggle his mic, video & leave the room
  useEffect(() => {
    if (!socket) return;

    function toggleMic(userId) {
      console.log(`User toggled their mic: ${userId}`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return copy;
      });
    }

    function toggleVideo(userId) {
      console.log(`User toggled their video: ${userId}`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return copy;
      });
    }

    function toggleLeave(userId) {
      console.log(`user with id ${userId} leave the room.`);
      alert(`user with id ${userId} leave the room`);
      const updatedPlayer = cloneDeep(players);
      delete updatedPlayer[userId];
      setPlayers(updatedPlayer);
    }

    socket.on(ACTIONS.USER_TOOGLE_AUDIO, toggleMic);
    socket.on(ACTIONS.USER_TOOGLE_VIDEO, toggleVideo);
    socket.on(ACTIONS.USER_LEAVE, toggleLeave);

    return () => {
      socket.off(ACTIONS.USER_TOOGLE_AUDIO, toggleMic);
      socket.off(ACTIONS.USER_TOOGLE_VIDEO, toggleVideo);
      socket.on(ACTIONS.USER_LEAVE, toggleLeave);
    };
  }, [socket, setPlayers]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <LoaderCircle className="loader" color="#7C3AED" />
        <p>Joining The Room...</p>
      </div>
    );
  }

  return (
    <div>
      <MeetingRoom
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
