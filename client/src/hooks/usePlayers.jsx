import { useState } from "react";
import { cloneDeep, update } from "lodash";
import { useSocket } from "@/context/Socket.jsx";
import { ACTIONS } from "@/actions.js";
import { useParams } from "react-router-dom";

export function usePlayers(myId) {
  const [players, setPlayers] = useState([]);
  const { socket } = useSocket();
  const { roomId } = useParams();
  const playerCopy = cloneDeep(players);
  const nonHighlightedPlayers = playerCopy[myId];
  delete playerCopy[myId];

  const highlightedPlayer = playerCopy;

  const toggleAudio = () => {
    console.log("toogle audio player");

    function checkThePlayerAndUpdateHisMic() {
        console.log("current players: ", playerCopy)
      const user = playerCopy[myId];
      if (!user) {
        console.error("Player not found:", myId);
        return user;
      }

      const updatedUser = { ...playerCopy };
      updatedUser[myId] = {
        ...updatedPlayers[myId],
        muted: !updatedPlayers[myId].muted,
      };
      setPlayers(updatedUser);
    }
    checkThePlayerAndUpdateHisMic();
    socket.emit(ACTIONS.USER_TOOGLE_AUDIO, { myId, roomId });

    return () => checkThePlayerAndUpdateHisMic();
  };

  const toggleVideo = () => {
    setPlayers((prev) => {
      if (!prev || !prev[myId]) {
        console.error("Player not found:", myId);
        return prev;
      }

      const updatedPlayers = { ...prev };
      updatedPlayers[myId] = {
        ...updatedPlayers[myId],
        playing: !updatedPlayers[myId].playing,
      };

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
