import React, { useState } from "react";
import "./form.css";
import { v4 as uuidV4 } from "uuid";
const Form = ({ handleChange, handleSubmit, formData, setFormData }) => {
  const [currentState, setCurrentState] = useState("join");
  return (
    <div className="glass-effect form-container">
      <h1>Create or Join Your Room</h1>

      {/* Toogle buttions for join and create room */}

      <div className="toogleTab">
        <button
          onClick={() => setCurrentState("join")}
          className={`toggle-btn ${currentState == "join" && "active"}`}
        >
          Join Room
        </button>
        <button
          onClick={() => setCurrentState("create")}
          className={`toggle-btn ${currentState == "create" && "active"}`}
        >
          Create Room
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
          className="input-field"
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
          <div className="roomId-box">
            <input
            className="input-field"
              type="text"
              id="roomId"
              name="roomId" // Updated to 'roomId'
              placeholder={
                currentState == "create"
                  ? "Generate your roomId"
                  : "Enter your roomId"
              }
              value={formData.roomId}
              onChange={handleChange}
              autoComplete="off"
              required
            />

            {
              currentState == "create" && (
                <button
                className="generate_id"
                onClick={(e) => {
                  e.preventDefault();
                  setFormData((prev) => ({ ...prev, roomId: uuidV4() })); // Update roomId here
                }}
              >
                Generate
              </button>
              )
            }
          </div>
        </div>

        <button type="submit" className="submit-button">
          Enter Room
        </button>
      </form>
    </div>
  );
};

export default Form;
