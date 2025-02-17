import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Form from "../components/CreateRoom/Form.jsx";
import CameraPreview from "../components/CreateRoom/CameraPreview.jsx";
import { useAvailableDevices } from "../hooks/useMediaDevices.jsx";
import { useSocket } from "../context/Socket.jsx";

const CreateRoom = () => {
  const [formData, setFormData] = useState({
    email: "",
    roomId: "", // Initialize roomId with a generated UUID
  });
  const [searchParam, setSearchParam] = useSearchParams();
  const { videoDevices } = useAvailableDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    videoDevices[0]?.deviceId
  );

  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    setSearchParam({
      type: searchParam.get("type") ?? "create",
      roomId: searchParam.get("roomId") ?? undefined,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!socket.connected) {
      socket.connect();
    }

    navigate(`/meeting/${formData.roomId}`, {
      state: {
        user: formData.email,
        deviceId: selectedDeviceId,
      },
    });
  };

  return (
    <main className="create_room_container">
      <CameraPreview
        videoDevices={videoDevices}
        setSelectedDeviceId={setSelectedDeviceId}
      />
      <Form
        searchParam={searchParam}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    </main>
  );
};

export default CreateRoom;
