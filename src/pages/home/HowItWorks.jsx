import {
  FaFileAlt,
  FaCheckCircle,
  FaMoneyBillWave,
  FaWpforms,
} from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <FaWpforms className="text-4xl text-[#162660]" />,
      title: "Apply Online",
      desc: "Choose your loan and fill out the application in minutes.",
    },
    {
      id: 2,
      icon: <FaFileAlt className="text-4xl text-[#162660]" />,
      title: "Submit Documents",
      desc: "Upload all required documents securely online.",
    },
    {
      id: 3,
      icon: <FaCheckCircle className="text-4xl text-[#162660]" />,
      title: "Get Approval",
      desc: "Our loan team reviews and approves your application quickly.",
    },
    {
      id: 4,
      icon: <FaMoneyBillWave className="text-4xl text-[#162660]" />,
      title: "Receive Money",
      desc: "Loan amount is transferred immediately after approval.",
    },
  ];

  return (
    <div
      className="py-20"
      style={{ background: "linear-gradient(to bottom, #D0E6FD, #F1E4D1)" }}
    >
      <h2 className="text-4xl font-extrabold text-center text-[#162660] mb-16">
        How It Works
      </h2>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-4 gap-20 px-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex flex-col items-center">
            {/* NUMBER BADGE (NOW FRONT + VISIBLE) */}
            <div className="absolute -top-8 z-20 bg-[#162660] text-white w-14 h-14 rounded-full flex justify-center items-center text-xl font-bold shadow-xl border-4 border-[#D0E6FD]">
              {step.id}
            </div>

            {/* CARD */}
            <div className="relative z-10 bg-white/95 backdrop-blur-md border border-[#D0E6FD] p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center max-w-[260px]">
              <div className="flex justify-center mb-4">{step.icon}</div>

              <h3 className="text-xl font-bold text-[#162660]">{step.title}</h3>

              <p className="text-gray-700 mt-2 leading-relaxed">{step.desc}</p>

              <div className="mt-5 w-full h-[3px] bg-gradient-to-r from-[#162660] via-[#D0E6FD] to-[#F1E4D1] rounded-full"></div>
            </div>

            {/* ARROW (Hide on last card) */}
            {index !== steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-14 transform -translate-y-1/2 z-30">
                <FaArrowRightLong className="text-4xl text-[#162660]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
