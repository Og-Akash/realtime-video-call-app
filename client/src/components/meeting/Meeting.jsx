import React, { createContext, useEffect, useMemo, useState } from "react";
import { VideoOff, Mic, MicOff, X, Pin, Send, User, User2 } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer.jsx";
import "./meeting.css";
import { useLocation, useParams } from "react-router-dom";
import { useAvailableDevices } from "@/hooks/useMediaDevices.jsx";
import { useMediaStream } from "@/hooks/useMediaStream.jsx";
import { Avatar } from "@/components/avatar/Avatar.jsx";
import { usePlayers } from "@/hooks/usePlayers.jsx";
import MeetingControlls from "./meeting-controlls";
import { useSocket } from "../../context/Socket";
import { ACTIONS } from "../../actions";

export const meetingContext = createContext(null);

const MeetingRoom = ({
  calls,
  myId,
  players,
  highlightedPlayer,
  nonHighlightedPlayers,
  setPlayers,
  connectedUsers,
}) => {
  const [sidebar, setSidebar] = useState({
    open: false,
    action: "",
  });
  const { videoDevices, audioDevices } = useAvailableDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    videoDevices[0]?.deviceId
  );
  const { socket } = useSocket();
  const { stream, updateStream } = useMediaStream(selectedDeviceId || "");
  const [currentTime, setCurrentTime] = useState("");
  const { toggleAudio, toggleVideo, leaveRoom } = usePlayers(myId);
  const [currentPlayers, setCurrentPlayers] = useState(null);
  const { roomId } = useParams();
  const [toogleDeviceBox, setToogleDeviceBox] = useState({
    audio: false,
    video: false,
  });
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessage] = useState([]);
  const { state } = useLocation();

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

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!message) return;

    const messageData = {
      roomId,
      message,
      username: state.user,
    };
    console.log(messageData);
    socket.emit(ACTIONS.SEND_MESSAGE, messageData);
    setMessage("");
  };

  //? checking users message socket event
  useEffect(() => {
    socket.on(ACTIONS.RECEIVE_MESSAGE, (msgData) => {
      setAllMessage((prev) => [...prev, msgData]);
    });

    socket.on("user_list", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.off(ACTIONS.RECEIVE_MESSAGE);
    };
  }, [socket, setAllMessage]);

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
          currentPlayers,
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
                    <span className="participant-name">
                      {currentPlayers[0].user}
                    </span>
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
                ? "Participants " + (connectedUsers.length) 
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
                <div className="participant-item">
                  <div className="participant-info">
                    <span className="participant-name">{state.user} (You)</span>
                     <div className="participant-status">
                        {userMediaState.isCurrentUserMuted && (
                          <MicOff size={14} className="status-icon" />
                        )}
                        {userMediaState.isCurrentUserVideoOff && (
                          <VideoOff size={14} className="status-icon" />
                        )}
                      </div>
                  </div>
                </div>
                {connectedUsers?.filter(user => user.username !== state.user).map((users) => (
                  <div key={users.socketId} className="participant-item">
                    <div className="participant-info">
                      <span className="participant-name">{users.username}</span>

                      {/* //* Future TODO add the funtionality to show the user mic and video status *\\ */}

                      {/* <div className="participant-status">
                        {players[peerId].isMuted && (
                          <MicOff size={14} className="status-icon" />
                        )}
                        {players[peerId].isVideoOff && (
                          <VideoOff size={14} className="status-icon" />
                        )}
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {allMessages.map((message) => (
                  <div key={message.sender} className="chat-message">
                    <div className="chat-header">
                      <span className="user-icon">
                        <User2 size={20} />
                      </span>
                      <span className="sender-name">
                        {message.sender === state.user
                          ? `${message.sender.slice(0, 10)} (You)`
                          : message.sender.slice(0, 10) + "..."}
                      </span>
                      <span className="message-time">{message.time}</span>
                    </div>
                    <div className="message-content">{message.message}</div>
                  </div>
                ))}
              </>
            )}
          </div>
          {sidebar.action === "chat" && (
            <form className="chat-input-box" onSubmit={handleMessageSubmit}>
              <input
                className="message-input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                name="message"
                placeholder="Type a message..."
              />
              <button className="send-btn">
                <Send />
              </button>
            </form>
          )}
        </div>
      </meetingContext.Provider>
    </div>
  );
};

export const SelectDevice = ({
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
          onClick={() => {
            setSelectedDeviceId(device.deviceId);
            onChangeDevice(device.deviceId); // Ensure updateStream is called
          }}
          key={device.deviceId}
        >
          {device.label || `Camera ${device.deviceId}`}
        </button>
        
        ))}
      </div>
    </div>
  );
};

export default MeetingRoom;
