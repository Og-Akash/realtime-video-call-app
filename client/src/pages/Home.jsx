import React from "react";
import "../App.css";
import Hero from "../components/Home/Hero";
import Featurers from "../components/Home/Featurers";
import Testimonal from "../components/Home/Testimonial";
import { Footer } from "../components/Home/Footer";

const Home = () => {
  return (
    <main className="home_container">
      <Hero />
      <Featurers />
      <Testimonal />
      <Footer />
    </main>
  );
};

export default Home;
