// PartnersMarquee.jsx
import React from "react";
import city from "../../assets/city-bank-seeklogo.png";
import ucb from "../../assets/united-commercial-bank-ucb-seeklogo.png";
import dbbl from "../../assets/dutch-bangla-bank-limited-seeklogo.png";
import standard from "../../assets/standard-bank-limited-seeklogo.png";
import brac from "../../assets/brac-bank-seeklogo.png";
import ific from "../../assets/ific-bank-seeklogo.png";

const partners = [
  {
    name: "BRAC Bank",
    logo: `${brac}`,
  },
  {
    name: "City Bank",
    logo: `${city}`,
  },
  {
    name: "Dutch‑Bangla Bank",
    logo: `${dbbl}`,
  },
  {
    name: "IFIC Bank",
    logo: `${ific}`,
  },
  {
    name: "Standard Bank",
    logo: `${standard}`,
  },
  {
    name: "United Commercial Bank (UCB)",
    logo: `${ucb}`,
  },
];

const PartnersMarquee = () => (
  <div className="bg-[#F1E4D1] py-8 overflow-hidden relative">
    <h2 className="text-2xl font-semibold text-center mb-6 text-[#162660]">
      Our Trusted Partners
    </h2>

    <div className="marquee flex gap-10">
      {partners.concat(partners).map((partner, i) => (
        <div
          key={i}
          className="flex items-center justify-center w-40 h-24 flex-shrink-0"
        >
          <img
            src={partner.logo}
            alt={partner.name}
            className="object-contain h-full"
          />
        </div>
      ))}
    </div>

    <style jsx>{`
      .marquee {
        display: flex;
        animation: scroll 20s linear infinite;
      }
      @keyframes scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
    `}</style>
  </div>
);

export default PartnersMarquee;
