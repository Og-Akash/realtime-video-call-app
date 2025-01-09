import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <section className="home_section">
      <h1> Meet with your Friends Live using {}</h1>
      <h1> LiveMeeter </h1>
      <div className="action_wrapper">
        <button onClick={() => navigate("/create-room")}>Create Room</button>
        <button onClick={() => navigate("/create-room")}>Join Room</button>
      </div>
    </section>
  );
};

export default Home;
