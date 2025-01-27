import { useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "@/context/Socket.jsx";
import { ACTIONS } from "@/actions.js";
import { useParams } from "react-router-dom";

export function usePlayers(myId) {
  const [players, setPlayers] = useState({});
  const { socket } = useSocket();
  const { roomId } = useParams();

  // Create copies of players for different views
  const playerCopy = cloneDeep(players);
  const nonHighlightedPlayers = playerCopy[myId];
  const highlightedPlayer = (() => {
    const copy = cloneDeep(players);
    delete copy[myId];
    return copy;
  })();

  const toggleAudio = (currentPlayers) => {
    console.log("toggle audio player");

    setPlayers(prevPlayers => {
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

  const toggleVideo = (currentPlayers) => {
    console.log("toggle video player");

    setPlayers(prevPlayers => {
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
  };
}