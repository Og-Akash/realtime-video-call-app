import React, { useState } from "react";
import "./cameraPreview.css";
import { Camera, CameraOff, Mic, MicOff, User } from "lucide-react";
import { useMediaStream } from "../../hooks/useMediaStream";
import VideoPlayer from "../VideoPlayer";

const CameraPreview = () => {
  const { stream } = useMediaStream();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);

  return (
    <div className="glass-effect cameraPreview-container">
      <h1>Camera Preview:</h1>
      <div className="camera-preview">
        {isCameraOn ? (
          <VideoPlayer muted={!isMicOn} playing={isCameraOn} stream={stream} />
        ) : (
          <User />
        )}
      </div>
      <div className="device-controls">
        <button className="glass-effect" onClick={() => setIsCameraOn(!isCameraOn)}>
          {isCameraOn ? <Camera /> : <CameraOff />}
        </button>
        <button className="glass-effect" onClick={() => setIsMicOn(!isMicOn)}>
          {isMicOn ? <Mic /> : <MicOff />}
        </button>
      </div>
    </div>
  );
};

export default CameraPreview;
