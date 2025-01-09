import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { useSocket } from "../context/Socket.jsx";
import { ACTIONS } from "../actions.js";

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
    socket.emit(ACTIONS.JOIN, {
      email: formData.email,
      roomId: formData.roomId,
    });
    navigate(`/meeting/${formData.roomId}`);
  };


  return (
    <div className="create_room_container">
      <Link to="/" className="back_btn">
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5"></path>
          <path d="M12 19l-7-7 7-7"></path>
        </svg>
      </Link>
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
