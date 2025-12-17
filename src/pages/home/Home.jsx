import React from "react";
import AvailableLoans from "./AvailableLoans";
import FeedbackCarousel from "./FeedbackCarousel";
import HowItWorks from "./HowItWorks";
import PartnersMarquee from "./PartnersMarquee";
import Hero from "./Hero";

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <AvailableLoans></AvailableLoans>
      <FeedbackCarousel></FeedbackCarousel>
      <HowItWorks></HowItWorks>
      <PartnersMarquee></PartnersMarquee>
    </div>
  );
};

export default Home;
