import React, { useState } from "react";
import "./cameraPreview.css";
import {
  Camera,
  CameraOff,
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  User,
} from "lucide-react";
import { useMediaStream } from "../../hooks/useMediaStream";
import VideoPlayer from "../VideoPlayer";
import { SelectDevice } from "../meeting/Meeting";

const CameraPreview = ({ videoDevices, setSelectedDeviceId }) => {
  const { stream, updateStream } = useMediaStream();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [videoList, setVideoList] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  const handleChangeDevice = (deviceId) => {
    setSelectedDeviceId(deviceId);
    updateStream(deviceId); 
  };

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
      {videoList && (
        <SelectDevice
          devices={videoDevices}
          setSelectedDeviceId={(id) => setSelectedDeviceId(id)}
          onChangeDevice={handleChangeDevice}
        />
      )}

      <div className="device-controls">
        <button onClick={() => setVideoList(!videoList)} className="arrow">
          {videoList ? (
            <ChevronUp size={16} className="icon" />
          ) : (
            <ChevronDown size={16} className="icon" />
          )}
        </button>
        <button
          className="glass-effect"
          onClick={() => setIsCameraOn(!isCameraOn)}
        >
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
