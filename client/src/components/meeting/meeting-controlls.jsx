import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    PhoneOff,
    Users,
    MessageSquare,
    MoreVertical,
    ChevronUp,
    ChevronDown,
  } from "lucide-react";
  import { useContext } from "react";
  import { meetingContext } from "./Meeting";
  
  const MeetingControls = () => {
    const {
      myId,
      userMediaState,
      toggleAudio,
      toggleVideo,
      handleToogleDeviceList,
      toogleDeviceBox,
      setPlayers,
      players,
      leaveRoom,
      sidebar,
      setSidebar,
    } = useContext(meetingContext);
  
    // Handler for the Chat button
    const handleChatClick = () => {
      setSidebar((prev) => {
        // If sidebar is closed, open with chat content
        if (!prev.open) {
          return { ...prev, open: true, action: "chat" };
        }
        // If open and already showing chat, close it
        if (prev.open && prev.action === "chat") {
          return { ...prev, open: false, action: "" };
        }
        // If open but showing something else (e.g. users), switch to chat
        return { ...prev, action: "chat" };
      });
    };
  
    // Handler for the Users button
    const handleUsersClick = () => {
      setSidebar((prev) => {
        if (!prev.open) {
          return { ...prev, open: true, action: "users" };
        }
        if (prev.open && prev.action === "users") {
          return { ...prev, open: false, action: "" };
        }
        return { ...prev, action: "users" };
      });
    };
  
    return (
      <div className="controls-center">
        {/* Audio Control */}
        <div id="mic" className="control-button">
          <button
            style={{
              background: userMediaState.isCurrentUserMuted
                ? "rgba(142, 9, 9, 0.838)"
                : "",
            }}
            onClick={() => {
              toggleAudio(players);
              setPlayers((prev) => {
                return {
                  ...prev,
                  [myId]: {
                    ...prev[myId],
                    muted: !prev[myId].muted,
                  },
                };
              });
            }}
          >
            {userMediaState.isCurrentUserMuted ? (
              <MicOff className="icon" />
            ) : (
              <Mic className="icon" />
            )}
          </button>
          <button
            onClick={() => handleToogleDeviceList("audio")}
            className="arrow"
          >
            {toogleDeviceBox.audio ? (
              <ChevronDown className="icon" />
            ) : (
              <ChevronUp className="icon" />
            )}
          </button>
        </div>
  
        {/* Video Control */}
        <div id="video" className="control-button">
          <button
            style={{
              background: userMediaState.isCurrentUserVideoOff
                ? "rgba(142, 9, 9, 0.838)"
                : "",
            }}
            onClick={() => {
              toggleVideo(players);
              setPlayers((prev) => {
                return {
                  ...prev,
                  [myId]: {
                    ...prev[myId],
                    playing: !prev[myId].playing,
                  },
                };
              });
            }}
          >
            {userMediaState.isCurrentUserVideoOff ? (
              <VideoOff size={24} className="icon" />
            ) : (
              <Video size={24} className="icon" />
            )}
          </button>
          <button
            onClick={() => handleToogleDeviceList("video")}
            className="arrow"
          >
            {toogleDeviceBox.video ? (
              <ChevronDown className="icon" />
            ) : (
              <ChevronUp className="icon" />
            )}
          </button>
        </div>
  
        {/* Chat Control */}
        <div className="control-button">
          <button
            style={{
              background: sidebar.action === "chat" ? "green" : "",
            }}
            onClick={handleChatClick}
            title="Show chat"
          >
            <MessageSquare className="icon" />
          </button>
        </div>
  
        {/* Users Control */}
        <div className="control-button">
          <button
            style={{
              background: sidebar.action === "users" ? "green" : "",
            }}
            onClick={handleUsersClick}
            title="Show users"
          >
            <Users size={24} className="icon" />
          </button>
        </div>
  
        {/* More Options */}
        <div className="control-button">
          <button title="More Options">
            <MoreVertical className="icon" />
          </button>
        </div>
  
        {/* End Call */}
        <div className="control-button">
          <button className="end-call" title="End Call" onClick={leaveRoom}>
            <PhoneOff className="icon" />
          </button>
        </div>
      </div>
    );
  };
  
  export default MeetingControls;
  