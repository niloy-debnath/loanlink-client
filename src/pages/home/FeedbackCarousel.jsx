import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { feedbackData } from "../../data/feedbackData";
import { AiFillStar } from "react-icons/ai";

const CustomerFeedback = () => {
  return (
    <div className="my-20 max-w-7xl mx-auto px-5">
      <h2
        className="text-4xl font-bold text-center mb-12"
        style={{ color: "#162660" }}
      >
        What Our Customers Say
      </h2>

      <Swiper
        slidesPerView={1}
        spaceBetween={25}
        autoplay={{ delay: 2000 }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {feedbackData.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className="p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border"
              style={{
                background: "linear-gradient(135deg, #D0E6FD 0%, #F1E4D1 100%)",
                borderColor: "#16266020",
              }}
            >
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                  style={{ border: "4px solid #162660" }}
                />

                {/* Name */}
                <h3
                  className="text-xl font-semibold mt-4"
                  style={{ color: "#162660" }}
                >
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex mt-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <AiFillStar key={i} size={22} color="#162660" />
                  ))}
                </div>

                {/* Review */}
                <p className="text-gray-800 mt-3 leading-relaxed">
                  {item.review}
                </p>

                {/* Divider */}
                <div
                  className="mt-4 w-full h-[2px]"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, #16266040, transparent)",
                  }}
                ></div>

                {/* Verified */}
                <p className="text-sm italic mt-3" style={{ color: "#162660" }}>
                  Verified Customer
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomerFeedback;
