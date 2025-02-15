import { useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "@/context/Socket.jsx";
import { ACTIONS } from "@/actions.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function usePlayers(myId, peer) {
  const [players, setPlayers] = useState({});
  const { socket } = useSocket();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  // Create copies of players for different views
  const playerCopy = cloneDeep(players);
  const nonHighlightedPlayers = playerCopy[myId];
  const highlightedPlayer = (() => {
    const copy = cloneDeep(players);
    delete copy[myId];
    return copy;
  })();

  //? leave room function when a user disconnects
  const leaveRoom = () => {
    socket.disconnect()
    socket.emit(ACTIONS.USER_LEAVE, { email: state.user, roomId, myId });
    peer?.disconnect();
    navigate("/");
  };

  //? Toggle Audio Device
  const toggleAudio = (currentPlayers) => {
    console.log("toggle audio player");

    setPlayers((prevPlayers) => {
      if (!currentPlayers[myId]) {
        console.error("Player not found:", myId);
        return currentPlayers;
      }

      const updatedPlayers = {
        ...currentPlayers,
        [myId]: {
          ...currentPlayers[myId],
          muted: !currentPlayers[myId].muted,
        },
      };

      // Emit the event after state update
      return updatedPlayers;
    });
    socket.emit(ACTIONS.USER_TOOGLE_AUDIO, { myId, roomId });
  };

  //? Toggle Video Device
  const toggleVideo = (currentPlayers) => {
    console.log("toggle video player");

    setPlayers((prevPlayers) => {
      if (!currentPlayers[myId]) {
        console.error("Player not found:", myId);
        return currentPlayers;
      }

      const updatedPlayers = {
        ...currentPlayers,
        [myId]: {
          ...currentPlayers[myId],
          playing: !currentPlayers[myId].playing,
        },
      };

      // Emit the event after state update
      return updatedPlayers;
    });
    socket.emit(ACTIONS.USER_TOOGLE_VIDEO, { myId, roomId });
  };

  return {
    players,
    setPlayers,
    highlightedPlayer,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  };
}
