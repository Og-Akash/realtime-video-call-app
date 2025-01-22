import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/Socket.jsx";
import { ACTIONS } from "@/actions.js";
import { usePeer } from "@/hooks/usePeer";
import { usePlayers } from "@/hooks/usePlayers.jsx";
import {useMediaStream} from "@/hooks/useMediaStream.jsx";
import {useAvailableDevices} from "@/hooks/useMediaDevices.jsx";
import MeetingRoom from "@/components/meeting/Meeting.jsx";

const Conference = () => {
    const { socket } = useSocket();
    const { peer, myId } = usePeer();
    const { players, setPlayers } = usePlayers();
    const [calls, setCalls] = useState({}); // Track ongoing calls
    const devices = useAvailableDevices()
    const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.deviceId);
    const { stream, updateStream} = useMediaStream(selectedDeviceId); // Modified hook to support stream updates

    // Handle new user joining
    useEffect(() => {
        if (!socket || !peer) return;

        const handleNewUserJoin = ({ peerId }) => {
            if (peerId === myId) return; // Skip self

            // Initiate a single call to the new user if not already connected
            if (!calls[peerId]) {
                console.log("stream", stream)
                const callInstance = peer.call(peerId, stream);
                console.log(callInstance)
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
    }, [peer, stream,socket, myId, players, calls, setPlayers]);

    // Handle incoming calls
    useEffect(() => {
            if (!peer) return;

            peer.on("call", (call) => {
                const {peer: callerId} = call;

                call.answer(stream);

                setCalls((prev) => ({...prev, [callerId]: call}));

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
                        const updatedCalls = {...prev};
                        delete updatedCalls[callerId];
                        return updatedCalls;
                    });

                    setPlayers((prev) => {
                        const updatedPlayers = {...prev};
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
        },
        [peer, stream,myId, players, setPlayers]);

    // Add local user to players
    useEffect(() => {
        if (!myId || !stream || !setPlayers) return;

        setPlayers((prev) => ({
            ...prev,
            [myId]: {
                stream: null, // Stream will be added once initialized
                muted: true, // Local video muted
                playing: true,
            },
        }));
    }, [myId, stream,setPlayers]);

    useEffect(() => {
        if (!stream || !calls) return;

        Object.values(calls).forEach((call) => {
            const sender = call.peerConnection
                ?.getSenders()
                ?.find((s) => s.track?.kind === "video");

            if (sender) {
                sender.replaceTrack(stream.getVideoTracks()[0]); // Replace video track
                console.log(`Replaced video track for call with ${call.peer}`);
            }
        });

        // Update local player's stream
        setPlayers((prev) => ({
            ...prev,
            [myId]: {
                ...prev[myId],
                stream: stream,
            },
        }));
    }, [stream, calls, myId, setPlayers]);
    //
    console.log("players", players);
    return (
        <div>
            {/* Video tags for each player */}
            <SelectDevice
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={setSelectedDeviceId}
                onChangeDevice={(deviceId) => updateStream(deviceId)} // Update stream on device change
            />
            {/*{Object.keys(players).map((playerId) => {*/}
            {/*    const { stream, muted, playing } = players[playerId];*/}
            {/*    return (*/}
            {/*        <VideoPlayer*/}
            {/*            key={playerId}*/}
            {/*            stream={stream}*/}
            {/*            playerId={playerId}*/}
            {/*            muted={muted}*/}
            {/*            playing={playing}*/}
            {/*        />*/}
            {/*    );*/}
            {/*})}*/}

            <MeetingRoom players={players} />
        </div>
    );
};

export default Conference;

function SelectDevice({ devices, selectedDeviceId, setSelectedDeviceId, onChangeDevice }) {
    return (
        <div>
            <label>Select Camera:</label>
            <select
                onChange={(e) => {
                    const deviceId = e.target.value;
                    setSelectedDeviceId(deviceId);
                    onChangeDevice(deviceId);
                }}
                value={selectedDeviceId || ""}
            >
                {devices?.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${device.deviceId}`}
                    </option>
                ))}
            </select>
        </div>
    );
}