import React from "react";
import "../App.css";
import Hero from "../components/Home/Hero";
import Featurers from "../components/Home/Featurers";

const Home = () => {

  return (
    <main className="home_container">
      <Hero />
      <Featurers />
    </main>
  );
};

export default Home;
