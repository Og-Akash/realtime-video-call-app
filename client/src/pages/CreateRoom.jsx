import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { useSocket } from "../context/Socket.jsx";
import { ACTIONS } from "../actions.js";
import {usePeer} from "@/hooks/usePeer.jsx";

const CreateRoom = () => {
  const [formData, setFormData] = useState({
    email: "",
    roomId: "", // Initialize roomId with a generated UUID
  });

  const { socket } = useSocket();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/meeting/${formData.roomId}`, {
      state: {
        email: formData.email,
      },
    });
  };


  return (
    <div className="create_room_container">
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h1>Create or Join Your Room</h1>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="roomId">Room Id:</label>
            <input
              type="text"
              id="roomId"
              name="roomId" // Updated to 'roomId'
              placeholder="generate your roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="generate_id"
            onClick={(e) => {
              e.preventDefault();
              setFormData((prev) => ({ ...prev, roomId: uuidV4() })); // Update roomId here
            }}
          >
            Generate UUID
          </button>

          <button type="submit" className="submit-button">
            Enter Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
