// Hero.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FcRight } from "react-icons/fc";
import { motion } from "framer-motion";
import { Link } from "react-router";

const Hero = () => {
  return (
    <div className="relative w-full h-[550px]">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 4000 }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {[
          "https://i.ibb.co/d40d1xYm/smiling-couple-showing-credit-card-13339-154325.jpg",
          "https://i.ibb.co/pjMYCMPv/woman-tea-plantation-smiles-camera-976492-52573.avif",
          "https://i.ibb.co/KpXtK2B8/stacked-coins-with-dirt-plant.jpg",
        ].map((img, index) => (
          <SwiperSlide key={index}>
            <motion.img
              src={img}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 4, ease: "easeOut" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* TEXT */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-5">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl"
        >
          FINANCING SOLUTIONS
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-4 text-lg md:text-xl max-w-2xl text-white drop-shadow-lg"
        >
          Smart financial services designed to support your future.
        </motion.p>
        <Link to="/loans">
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-7 py-3 bg-[#D0E6FD] text-[#0f1b49] font-semibold rounded-md shadow-lg hover:bg-[#0f1b49] transition hover:text-white flex items-center gap-2 border-2 border-[#0f1b49]"
          >
            See All Loans <FcRight />
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
