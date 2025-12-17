// AllLoansPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { TbFidgetSpinner } from "react-icons/tb";

const AllLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/loans`)
      .then((res) => setLoans(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleViewDetails = (loanId) => {
    navigate(`/loans/${loanId}`);
  };
  if (!Array.isArray(loans) || loans.length === 0) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <TbFidgetSpinner className="animate-spin text-5xl text-[#162660]" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-10 px-6 bg-[#D0E6FD]">
      <h1 className="text-3xl font-bold text-center text-[#162660] mb-8">
        All Loans
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loans.map((loan) => (
          <div
            key={loan._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <img
              src={loan.image}
              alt={loan.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-semibold text-[#162660] mb-2">
                {loan.title}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Category:</span> {loan.category}
              </p>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Interest:</span> {loan.interest}%
              </p>

              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Max Limit:</span>{" "}
                {loan.maxLimit
                  ? `BDT ${loan.maxLimit.toLocaleString()}`
                  : "N/A"}
              </p>

              <button
                onClick={() => handleViewDetails(loan._id)}
                className="w-full bg-[#162660] text-white py-2 rounded-xl hover:bg-[#0f1b4d] transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllLoansPage;
