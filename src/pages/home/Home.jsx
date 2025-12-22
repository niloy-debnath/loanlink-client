import React from "react";
import AvailableLoans from "./AvailableLoans";
import FeedbackCarousel from "./FeedbackCarousel";
import HowItWorks from "./HowItWorks";
import PartnersMarquee from "./PartnersMarquee";
import Hero from "./Hero";
import PageTitle from "../../components/PageTitle";

const Home = () => {
  return (
    <div>
      <PageTitle title="Home"></PageTitle>
      <Hero></Hero>
      <AvailableLoans></AvailableLoans>
      <FeedbackCarousel></FeedbackCarousel>
      <HowItWorks></HowItWorks>
      <PartnersMarquee></PartnersMarquee>
    </div>
  );
};

export default Home;
