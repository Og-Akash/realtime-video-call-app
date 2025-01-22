import {useState} from "react";

export function usePlayers() {
    const [players, setPlayers] = useState([])

    return {
        players,
        setPlayers
    }
}