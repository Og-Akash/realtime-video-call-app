import { Shield, UsersRound, Zap } from "lucide-react";
import React from "react";
import "./features.css"
const Featurers = () => {
  return (
    <main className="wrapper">
      <h1 className="feature-heading">Key Features</h1>
      <div className="features_section">
        <div className="feature glass-effect">
          <div className="icon glass-effect">
            <Zap color="#60A5FA" />
          </div>
          <div className="heading">Lightning Fast</div>
          <div className="subhead">
            Experience crystal clear video calls with minimal latency and
            maximum quality.
          </div>
        </div>
        <div className="feature glass-effect">
          <div className="icon glass-effect">
            <UsersRound color="#34D399" />
          </div>
          <div className="heading">Team Friendly</div>
          <div className="subhead">
            Perfect for team meetings, webinars, and collaborative sessions.
          </div>
        </div>
        <div className="feature glass-effect">
          <div className="icon glass-effect">
            <Shield color="#60A5FA" />
          </div>
          <div className="heading">Secure & Private</div>
          <div className="subhead">
            End-to-end encryption ensures your conversations stay private and
            secure.
          </div>
        </div>
      </div>
    </main>
  );
};

export default Featurers;
