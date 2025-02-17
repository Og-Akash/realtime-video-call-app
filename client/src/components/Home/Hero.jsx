import React from "react";
import { useNavigate } from "react-router-dom";
import { Video, Users } from "lucide-react";
import "./hero.css"; // Import the CSS file

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="home_container">
      <div className="container">
        <div className="left">
          <h1 className="title">Connect Instantly with LiveMeeter</h1>
          <p className="subtitle">
            Experience crystal-clear video calls with unlimited participants. No
            downloads required - just create or join a room and start connecting
            with your team.
          </p>
          <div className="buttons">
            <button onClick={() => navigate("/rooms?type=create")} className="button button-primary">
              <Video size={20} />
              Create Room
            </button>
            <button onClick={() => navigate("/rooms?type=join&roomId=sdhfshdfhsdhsfh")} className="button button-secondary">
              <Users size={20} />
              Join Room
            </button>
          </div>
        </div>
        <div className="right">
          <img width={500} src="./heroimage.jpeg" alt="home-image" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
