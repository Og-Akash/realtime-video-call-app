import React, { useEffect, useMemo, useState } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  X,
  MessageSquare,
  MoreVertical,
  Pin,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer.jsx";
import "./meeting.css";
import { useLocation, useParams } from "react-router-dom";
import { useAvailableDevices } from "@/hooks/useMediaDevices.jsx";
import { useMediaStream } from "@/hooks/useMediaStream.jsx";
import { Avatar } from "@/components/avatar/Avatar.jsx";
import { usePlayers } from "@/hooks/usePlayers.jsx";

const MeetingRoom = ({
  calls,
  myId,
  players,
  highlightedPlayer,
  nonHighlightedPlayers,
  setPlayers,
}) => {
  const [mediaState, setMediaState] = useState({
    showParticipants: false,
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

  useEffect(() => {
    if (highlightedPlayer == null) return;
    const filteredPlayers = Object.keys(highlightedPlayer)
      .filter(
        (playerId) => playerId !== "" && highlightedPlayer[playerId]?.stream
      )
      .map((playerId) => highlightedPlayer[playerId]);

    setCurrentPlayers(filteredPlayers);
  }, [highlightedPlayer]);

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
      <div
        className={`meeting-content ${
          mediaState.showParticipants ? "with-sidebar" : ""
        }`}
      >
        {nonHighlightedPlayers && (
          <div className="highlighted-video-player-container">
            {userMediaState.isCurrentUserVideoOff ? (
              <div className="video-placeholder">
                <Avatar name={"Yash"} />
              </div>
            ) : (
              <VideoPlayer
                stream={nonHighlightedPlayers.stream}
                muted={nonHighlightedPlayers.muted}
                playing={
                  !userMediaState.isCurrentUserVideoOff &&
                  nonHighlightedPlayers.playing
                }
                classNames="highlighted-video-player"
              />
            )}
            {userMediaState.isCurrentUserMuted ? <MicOff /> : <Mic />}
          </div>
        )}
        <div className="video-grid">
          {currentPlayers?.map((player, index) => {
            const { stream, muted, playing } = player;
            return (
              <div key={index} className="video-container main-video">
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
                    <Avatar name={"Yash"} />
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

        <div className="meeting-controls">
          <div className="controls-left">
            <span className="meeting-time">{currentTime}</span>
          </div>

          {toogleDeviceBox["audio"] ? (
            <SelectDevice
              devices={audioDevices}
              selectedDeviceId={selectedDeviceId}
              setSelectedDeviceId={setSelectedDeviceId}
              onChangeDevice={updateStream}
              setToogleDeviceBox={setToogleDeviceBox}
            />
          ) : toogleDeviceBox["video"] ? (
            <SelectDevice
              devices={videoDevices}
              selectedDeviceId={selectedDeviceId}
              setSelectedDeviceId={setSelectedDeviceId}
              onChangeDevice={updateStream}
              setToogleDeviceBox={setToogleDeviceBox}
            />
          ) : null}

          <div className="controls-center">
            <div
              className="control-button"
              title={userMediaState.isCurrentUserMuted ? "Unmute" : "Mute"}
            >
              <div className="control-button-options">
                <button
                  onClick={() => handleToogleDeviceList("audio")}
                  className="control-button-options-arrow"
                >
                  {toogleDeviceBox.audio ? <ChevronDown /> : <ChevronUp />}
                </button>
                <button
                  className={`${
                    userMediaState.isCurrentUserMuted ? "active" : ""
                  }`}
                  onClick={() => {
                    toggleAudio(players);
                    setPlayers((prev) => {
                      const updatedPlayers = {
                        ...prev,
                        [myId]: {
                          ...prev[myId],
                          muted: !prev[myId].muted,
                        },
                      };
                      return updatedPlayers;
                    });
                  }}
                >
                  {userMediaState.isCurrentUserMuted ? <MicOff /> : <Mic />}
                </button>
              </div>
              <span className="button-label">
                {userMediaState.isCurrentUserMuted ? "Unmute" : "Mute"}
              </span>
            </div>

            <div
              className="control-button"
              title={
                userMediaState.isCurrentUserVideoOff
                  ? "Start Video"
                  : "Stop Video"
              }
            >
              <div className="control-button-options">
                <button
                  onClick={() => handleToogleDeviceList("video")}
                  className="control-button-options-arrow"
                >
                  {toogleDeviceBox.video ? <ChevronDown /> : <ChevronUp />}
                </button>
                <button
                  className={`${
                    userMediaState.isCurrentUserVideoOff ? "active" : ""
                  }`}
                  onClick={() => {
                    toggleVideo(players);
                    setPlayers((prev) => {
                      const updatedPlayers = {
                        ...prev,
                        [myId]: {
                          ...prev[myId],
                          playing: !prev[myId].playing,
                        },
                      };
                      return updatedPlayers;
                    });
                  }}
                >
                  {userMediaState.isCurrentUserVideoOff ? (
                    <VideoOff size={24} />
                  ) : (
                    <Video size={24} />
                  )}
                </button>
              </div>
              <span className="button-label">
                {userMediaState.isCurrentUserVideoOff
                  ? "Start Video"
                  : "Stop Video"}
              </span>
            </div>

            <div className="control-button" title="Open Chat">
              <MessageSquare size={24} />
              <span className="button-label">Chat</span>
            </div>

            <button
              className={`control-button ${
                mediaState.showParticipants ? "active" : ""
              }`}
              onClick={() =>
                setMediaState((prev) => ({
                  ...prev,
                  showParticipants: !prev.showParticipants,
                }))
              }
              title="Show Participants"
            >
              <Users size={24} />
              <span className="button-label">Participants</span>
            </button>

            <button className="control-button" title="More Options">
              <MoreVertical size={24} />
              <span className="button-label">More</span>
            </button>

            <button className="control-button end-call" title="End Call" onClick={leaveRoom}>
              <PhoneOff size={20} />
              <span className="button-label">End</span>
            </button>
          </div>

          <div className="controls-right">
            <span className="meeting-id">Meeting {roomId}</span>
          </div>
        </div>
      </div>

      <div
        className={`participants-sidebar ${
          mediaState.showParticipants ? "show" : ""
        }`}
      >
        <div className="sidebar-header">
          <h2>Participants (3)</h2>
          <button
            className="close-sidebar"
            onClick={() =>
              setMediaState((prev) => ({
                ...prev,
                showParticipants: false,
              }))
            }
          >
            <X size={20} />
          </button>
        </div>
        <div className="participants-list">
          {participants.map((participant) => (
            <div key={participant.id} className="participant-item">
              <div className="participant-info">
                <span className="participant-name">{participant.name}</span>
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
      </div>
    </div>
  );
};

const SelectDevice = ({
  setToogleDeviceBox,
  devices,
  selectedDeviceId,
  setSelectedDeviceId,
  onChangeDevice,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <select
        className="select-devices"
        onChange={(e) => {
          const deviceId = e.target.value;
          setSelectedDeviceId(deviceId);
          onChangeDevice(deviceId);
          setToogleDeviceBox({
            audio: false,
            video: false,
          });
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
};

export default MeetingRoom;
