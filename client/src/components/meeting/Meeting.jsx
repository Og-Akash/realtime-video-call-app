import React, { useEffect, useState } from "react";
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
  toggleAudio,
  players,
  highlightedPlayer,
  nonHighlightedPlayers,
  setPlayers,
}) => {
  const [mediaState, setMediaState] = useState({
    isMuted: false,
    isVideoOff: false,
    showParticipants: false,
  });
  const { videoDevices, audioDevices } = useAvailableDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    videoDevices[0]?.deviceId
  );
  const { stream, updateStream } = useMediaStream(selectedDeviceId);
  const [currentTime, setCurrentTime] = useState("");
  const [currentPlayers, setCurrentPlayers] = useState(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [toogleDeviceBox, setToogleDeviceBox] = useState({
    audio: false,
    video: false,
  });

  // Mock participants data
  const participants = [
    { id: 1, name: "Akash Ghosh", isMuted: false, isVideoOff: false },
    {
      id: 2,
      name: "Jane Smith",
      isMuted: false,
      isVideoOff: false,
    },
    { id: 3, name: "Mike Johnson", isMuted: false, isVideoOff: true },
  ];

  useEffect(() => {
    const updateCurrentTime = () => {
      const time = new Date();
      const hours = time.getHours() % 12 || 12; // Convert 24-hour time to 12-hour
      const minutes = time.getMinutes().toString().padStart(2, "0");
      const ampm = time.getHours() < 12 ? "AM" : "PM";
      return `${hours}:${minutes} ${ampm}`;
    };

    setCurrentTime(updateCurrentTime()); // Set the initial time

    const intervalId = setInterval(() => {
      setCurrentTime(updateCurrentTime());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []); // Empty dependency array to prevent re-runs

  useEffect(() => {
    // Filter players whenever `players` changes
    if (players == null) return;
    const filteredPlayers = Object.keys(players)
      .filter((playerId) => playerId !== "" && players !== players[myId])
      .map((playerId) => players[playerId]);

    setCurrentPlayers(filteredPlayers); // Update the state with the filtered list
  }, [players]); // Dependency array

  // Changing the video stream when user change the device.
  useEffect(() => {
    if (!stream || !calls) return;

    Object.values(calls).forEach((call) => {
      const sender = call.peerConnection
        ?.getSenders()
        ?.find((s) => s.track?.kind === "video");

      if (sender) {
        sender.replaceTrack(stream.getVideoTracks()[0]); // Replace video track
        // console.log(`Replaced video track for call with ${call.peer}`);
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

  const handleToogleDeviceList = (deviceType) => {
    setToogleDeviceBox((prev) => ({
      prev: false,
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
        {/* Video Player for the room */}
        {nonHighlightedPlayers && (
          <div>
            <VideoPlayer
              stream={nonHighlightedPlayers.stream}
              muted={nonHighlightedPlayers.muted}
              playing={!mediaState.isVideoOff && nonHighlightedPlayers.playing}
              classNames="highlighted-video-player"
            />
          </div>
        )}
        <div className="video-grid">
          {currentPlayers?.map((player, index) => {
            const { stream, muted, playing } = player;
            return (
              <div key={index} className="video-container main-video">
                {!mediaState.isVideoOff ? (
                  <VideoPlayer
                    stream={stream}
                    playerId={index}
                    muted={muted}
                    playing={!mediaState.isVideoOff && playing}
                    classNames="video-player"
                  />
                ) : (
                  <div className="video-placeholder">
                    {/*<Video className="video-icon"/>*/}
                    <Avatar name={"Yash"} />
                  </div>
                )}
                <div className="video-info">
                  <span className="participant-name">Akash Ghosh (You)</span>
                  {mediaState.isMuted && (
                    <MicOff className="status-icon" size={16} />
                  )}
                </div>
                <button className="pin-button">
                  <Pin size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Making the Controls for the room */}
        <div className="meeting-controls">
          <div className="controls-left">
            <span className="meeting-time">{currentTime}</span>
          </div>

          {/* DropDown to Media Select Devices */}

          {toogleDeviceBox["audio"] ? (
            <SelectDevice
              devices={audioDevices}
              selectedDeviceId={selectedDeviceId}
              setSelectedDeviceId={setSelectedDeviceId}
              onChangeDevice={(deviceId) => updateStream(deviceId)} // Update stream on device change
              setToogleDeviceBox={setToogleDeviceBox}
            />
          ) : toogleDeviceBox["video"] ? (
            <SelectDevice
              devices={videoDevices}
              selectedDeviceId={selectedDeviceId}
              setSelectedDeviceId={setSelectedDeviceId}
              onChangeDevice={(deviceId) => updateStream(deviceId)} // Update stream on device change
              setToogleDeviceBox={setToogleDeviceBox}
            />
          ) : null}

          <div className="controls-center">
            <div
              className="control-button"
              title={mediaState.isMuted ? "muted" : "mic on"}
            >
              <div className="control-button-options">
                <button
                  onClick={() => handleToogleDeviceList("audio")}
                  className="control-button-options-arrow"
                >
                  {toogleDeviceBox.audio ? <ChevronDown /> : <ChevronUp />}
                </button>
                <button
                  className={`${mediaState.isMuted ? "active" : ""}`}
                  onClick={toggleAudio}
                >
                  {mediaState.isMuted ? <MicOff /> : <Mic />}
                </button>
              </div>
              <span className="button-label">Mute Mic</span>
            </div>

            <div
              className="control-button"
              title={mediaState.isMuted ? "Stop Video" : "On Video"}
            >
              <div className="control-button-options">
                <button
                  onClick={() => handleToogleDeviceList("video")}
                  className="control-button-options-arrow"
                >
                  {toogleDeviceBox.video ? <ChevronDown /> : <ChevronUp />}
                </button>
                <button
                  className={`${mediaState.isVideoOff ? "active" : ""}`}
                  onClick={() =>
                    setMediaState((prev) => ({
                      ...prev,
                      isVideoOff: !prev.isVideoOff,
                    }))
                  }
                >
                  {mediaState.isVideoOff ? (
                    <VideoOff size={24} />
                  ) : (
                    <Video size={24} />
                  )}
                </button>
              </div>
              <span className="button-label">Stop Video</span>
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

            <button className="control-button end-call" title="End Call">
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

export default MeetingRoom;

function SelectDevice({
  setToogleDeviceBox,
  devices,
  selectedDeviceId,
  setSelectedDeviceId,
  onChangeDevice,
}) {
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
}
