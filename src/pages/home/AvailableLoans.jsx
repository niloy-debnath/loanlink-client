import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { HiArrowCircleRight } from "react-icons/hi";
import { TbFidgetSpinner } from "react-icons/tb";

const AvailableLoans = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/loans/home`)
      .then((res) => setLoans(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!Array.isArray(loans) || loans.length === 0) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <TbFidgetSpinner className="animate-spin text-5xl text-[#162660]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-20 rounded-xl bg-[#D0E6FD]">
      <h2 className="text-4xl font-extrabold text-center text-[#162660] mb-12">
        Available Loans
      </h2>

      <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {loans.slice(0, 6).map((loan) => (
          <div
            key={loan._id}
            className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#162660]/50 hover:backdrop-blur-sm flex flex-col overflow-hidden hover:scale-105"
          >
            <div className="h-48 w-full rounded-t-2xl overflow-hidden">
              <img
                src={loan.image}
                alt={loan.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-[#162660] mb-2">
                {loan.title}
              </h3>
              <p className="text-gray-700 mb-4 flex-1">
                {loan.shortDesc || "No description available."}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <span className="font-semibold text-[#0B89A7]">
                  Max Limit: ৳
                  {loan.maxLimit ? loan.maxLimit.toLocaleString() : "N/A"}
                </span>
                <Link
                  to={`/loans/${loan._id}`}
                  className="px-4 py-2 bg-[#162660] text-white rounded-lg hover:bg-[#0B89A7] transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-8 px-6 flex justify-end">
        <Link
          to="/loans"
          className="flex items-center gap-2 text-[#162660] font-bold text-lg hover:text-[#0b89a7] transition"
        >
          <span>All Loans</span>
          <HiArrowCircleRight className="  rounded-full" size={24} />
        </Link>
      </div>
    </div>
  );
};

export default AvailableLoans;
