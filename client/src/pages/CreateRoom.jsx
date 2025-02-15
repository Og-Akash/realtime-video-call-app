import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSocket } from "../context/Socket.jsx";
import { ACTIONS } from "../actions.js";
import { usePeer } from "@/hooks/usePeer.jsx";
import Form from "../components/CreateRoom/Form.jsx";
import CameraPreview from "../components/CreateRoom/CameraPreview.jsx";

const CreateRoom = () => {
  const [formData, setFormData] = useState({
    email: "",
    roomId: "", // Initialize roomId with a generated UUID
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/meeting/${formData.roomId}`, {
      state: {
        user: formData.email,
      },
    });
  };

  return (
    <main className="create_room_container">
      <CameraPreview />
      <Form
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    </main>
  );
};

export default CreateRoom;
