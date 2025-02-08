import React, { createContext, useEffect, useMemo, useState } from "react";
import { VideoOff, Mic, MicOff, X, Pin } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer.jsx";
import "./meeting.css";
import { useLocation, useParams } from "react-router-dom";
import { useAvailableDevices } from "@/hooks/useMediaDevices.jsx";
import { useMediaStream } from "@/hooks/useMediaStream.jsx";
import { Avatar } from "@/components/avatar/Avatar.jsx";
import { usePlayers } from "@/hooks/usePlayers.jsx";
import MeetingControlls from "./meeting-controlls";

export const meetingContext = createContext(null);

const MeetingRoom = ({
  calls,
  myId,
  players,
  highlightedPlayer,
  nonHighlightedPlayers,
  setPlayers,
}) => {
  const [sidebar, setSidebar] = useState({
    open: false,
    action: "",
  });
  const { videoDevices, audioDevices } = useAvailableDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    videoDevices[0]?.deviceId
  );
  const { stream, updateStream } = useMediaStream(selectedDeviceId);
  const [currentTime, setCurrentTime] = useState("");
  const { toggleAudio, toggleVideo, leaveRoom } = usePlayers(myId);
  const [currentPlayers, setCurrentPlayers] = useState(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [toogleDeviceBox, setToogleDeviceBox] = useState({
    audio: false,
    video: false,
  });

  // Memoize user media states
  const userMediaState = useMemo(() => {
    return {
      isCurrentUserMuted: players[myId]?.muted || false,
      isCurrentUserVideoOff: !players[myId]?.playing || false,
    };
  }, [players, myId]);

  // Mock participants data
  const participants = [
    { id: 1, name: "Akash Ghosh", isMuted: false, isVideoOff: false },
    { id: 2, name: "Jane Smith", isMuted: false, isVideoOff: false },
    { id: 3, name: "Mike Johnson", isMuted: false, isVideoOff: true },
  ];

  useEffect(() => {
    const updateCurrentTime = () => {
      const time = new Date();
      const hours = time.getHours() % 12 || 12;
      const minutes = time.getMinutes().toString().padStart(2, "0");
      const ampm = time.getHours() < 12 ? "AM" : "PM";
      return `${hours}:${minutes} ${ampm}`;
    };

    setCurrentTime(updateCurrentTime());

    const intervalId = setInterval(() => {
      setCurrentTime(updateCurrentTime());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // ? filtering the current players who have a peerid
  useEffect(() => {
    if (highlightedPlayer == null) return;
    const filteredPlayers = Object.keys(highlightedPlayer)
      .filter(
        (playerId) => playerId !== "" && highlightedPlayer[playerId]?.stream
      )
      .map((playerId) => highlightedPlayer[playerId]);

    setCurrentPlayers(filteredPlayers);
  }, [highlightedPlayer]);

  // ? update the stream data when user change his camera device
  useEffect(() => {
    if (!stream || !calls) return;

    Object.values(calls).forEach((call) => {
      const sender = call.peerConnection
        ?.getSenders()
        ?.find((s) => s.track?.kind === "video");

      if (sender) {
        sender.replaceTrack(stream.getVideoTracks()[0]);
      }
    });

    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        ...prev[myId],
        stream: stream,
      },
    }));
  }, [stream, calls, myId, setPlayers]);

  const handleToogleDeviceList = (deviceType) => {
    setToogleDeviceBox((prev) => ({
      audio: false,
      video: false,
      [deviceType]: !prev[deviceType],
    }));
  };

  return (
    <div className="meeting-container">
      <meetingContext.Provider
        value={{
          myId,
          userMediaState,
          toggleAudio,
          toggleVideo,
          handleToogleDeviceList,
          toogleDeviceBox,
          setPlayers,
          leaveRoom,
          sidebar,
          setSidebar,
        }}
      >
        <div className={`meeting-content`}>
          <div className={`video-grid ${sidebar.open ? "with-sidebar" : ""}`}>
            {nonHighlightedPlayers && (
              <div className="nonhighlighted-video-player-container">
                {userMediaState.isCurrentUserVideoOff ? (
                  <div className="video-placeholder">
                    <Avatar name={"Yash"} className="small" />
                  </div>
                ) : (
                  <VideoPlayer
                    stream={nonHighlightedPlayers.stream}
                    muted={nonHighlightedPlayers.muted}
                    playing={
                      !userMediaState.isCurrentUserVideoOff &&
                      nonHighlightedPlayers.playing
                    }
                    classNames="nonhighlighted-video-player"
                  />
                )}
                <span className="currrentUser-name">John Doe</span>
                {userMediaState.isCurrentUserMuted ? <MicOff /> : <Mic />}
              </div>
            )}
            {currentPlayers?.map((player, index) => {
              const { stream, muted, playing } = player;
              return (
                <div key={index} className="main-video-container">
                  {playing ? (
                    <VideoPlayer
                      stream={stream}
                      playerId={index}
                      muted={muted}
                      playing={!userMediaState.isCurrentUserVideoOff && playing}
                      classNames="video-player"
                    />
                  ) : (
                    <div className="video-placeholder">
                      <Avatar name={"Yash"} className="big" />
                    </div>
                  )}
                  <div className="video-info">
                    <span className="participant-name">Akash Ghosh (You)</span>
                    {muted ? (
                      <MicOff className="status-icon" size={16} />
                    ) : (
                      <Mic className="status-icon" size={16} />
                    )}
                  </div>
                  <button className="pin-button">
                    <Pin size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Todo Make the controls  */}

          <div className="meeting-controls">
            {/* Showing the curren time */}
            <div className="controls-left">
              <span className="meeting-time">{currentTime}</span>
            </div>

            {/* showing the Controls */}

            {toogleDeviceBox["audio"] ? (
              <SelectDevice
                devices={audioDevices}
                setSelectedDeviceId={setSelectedDeviceId}
                onChangeDevice={updateStream}
                setToogleDeviceBox={setToogleDeviceBox}
              />
            ) : toogleDeviceBox["video"] ? (
              <SelectDevice
                devices={videoDevices}
                setSelectedDeviceId={setSelectedDeviceId}
                onChangeDevice={updateStream}
                setToogleDeviceBox={setToogleDeviceBox}
              />
            ) : null}

            <MeetingControlls />

            {/* showing the room id */}

            <div className="controls-right">
              <span className="meeting-id">Meeting {roomId}</span>
            </div>
          </div>
        </div>

        <div className={`sidebar ${sidebar.open ? "show" : ""}`}>
          <div className="sidebar-header">
            <h2>
              {sidebar.action === "users"
                ? "Participants (3)"
                : sidebar.action === "chat"
                ? "Chat Messages"
                : ""}
            </h2>
            <button
              className="close-sidebar"
              onClick={() =>
                setSidebar((prev) => ({ ...prev, open: false, action: "" }))
              }
            >
              <X size={20} />
            </button>
          </div>
          <div className="sidebar-content">
            {sidebar.action === "users" ? (
              <div className="participants-list">
                {participants.map((participant) => (
                  <div key={participant.id} className="participant-item">
                    <div className="participant-info">
                      <span className="participant-name">
                        {participant.name}
                      </span>
                      <div className="participant-status">
                        {participant.isMuted && (
                          <MicOff size={14} className="status-icon" />
                        )}
                        {participant.isVideoOff && (
                          <VideoOff size={14} className="status-icon" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="chat-messages">
                <span>very nice site.</span>
                <br />
                <br />
                <span>good job buddy.</span>
              </div>
            )}
          </div>
          {sidebar.action === "chat" && (
            <div className="chat-input">
              <input type="text" placeholder="Type a message..." />
              <button>Send</button>
            </div>
          )}
        </div>
      </meetingContext.Provider>
    </div>
  );
};

const SelectDevice = ({
  setToogleDeviceBox,
  devices,
  setSelectedDeviceId,
  onChangeDevice,
}) => {
  return (
    <div
      className="choose-device-container"
      style={{
        position: "absolute",
        bottom: 15,
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="choose-device-box">
        {devices?.map((device) => (
          <button
            className="choose-device-btn"
            onClick={(e) => {
              setSelectedDeviceId(device.deviceId);
              onChangeDevice(device.deviceId);
              setToogleDeviceBox({
                audio: false,
                video: false,
              });
            }}
            key={device.deviceId}
            value={device.deviceId}
          >
            {device.label || `Camera ${device.deviceId}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MeetingRoom;
