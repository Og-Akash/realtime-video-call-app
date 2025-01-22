import React from "react";
import "../App.css";
import {useNavigate} from "react-router-dom";
import {Video, Users} from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="container">
            <h1 className="title">Connect Instantly with LiveMeeter</h1>
            <p className="subtitle">
                Experience crystal-clear video calls with unlimited participants. No
                downloads required - just create or join a room and start connecting
                with your team.
            </p>
            <div className="buttons">
                <button onClick={() => navigate("/create-room")} className="button button-primary">
                    <Video size={20}/>
                    Create Room
                </button>
                <button onClick={() => navigate("/create-room")} className="button button-secondary">
                    <Users size={20}/>
                    Join Room
                </button>
            </div>
        </div>
    );
};

export default Home;
