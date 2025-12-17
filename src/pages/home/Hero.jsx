// Hero.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FcRight } from "react-icons/fc";

const Hero = () => {
  return (
    <div className="relative w-full h-[550px]">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 4000 }}
        navigation={true}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full"
      >
        <SwiperSlide>
          <img
            src="https://i.ibb.co/d40d1xYm/smiling-couple-showing-credit-card-13339-154325.jpg"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src="https://i.ibb.co/pjMYCMPv/woman-tea-plantation-smiles-camera-976492-52573.avif"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src="https://i.ibb.co/KpXtK2B8/stacked-coins-with-dirt-plant.jpg"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      </Swiper>

      {/* overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* TEXT */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-5">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl">
          FINANCING SOLUTIONS
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl text-white drop-shadow-lg">
          Smart financial services designed to support your future.
        </p>

        <button className="mt-6 px-7 py-3 bg-[#D0E6FD] text-[#0f1b49] font-semibold rounded-md shadow-lg hover:bg-[#0f1b49] transition hover:text-white flex items-center gap-2 border-2 border-[#0f1b49]">
          Apply Now <FcRight />
        </button>
      </div>
    </div>
  );
};

export default Hero;
