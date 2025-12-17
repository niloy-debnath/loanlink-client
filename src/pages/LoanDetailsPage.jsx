import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { TbFidgetSpinner } from "react-icons/tb";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth"; // your firebase auth

const LoanDetailsPage = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // firebase user (email, uid, etc.)

  const [loan, setLoan] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // full user from MongoDB
  const [loading, setLoading] = useState(true);

  // Fetch loan details
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/loans/${loanId}`)
      .then((res) => setLoan(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [loanId]);

  // Fetch full user info (MongoDB) to get role
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/users/${user.email}`)
        .then((res) => setUserInfo(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleApply = () => {
    if (!user) {
      toast.error("You must be logged in to apply for a loan!");
      navigate("/login");
      return;
    }

    if (userInfo?.role !== "borrower") {
      toast.error("Only borrowers can apply for a loan!");
      return;
    }

    navigate(`/apply-loan/${loanId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <TbFidgetSpinner className="animate-spin text-5xl text-[#162660]" />
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center text-xl text-[#162660] font-semibold">
        Loan not found
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-100 py-12 px-4 md:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10 flex flex-col md:flex-col gap-6">
        {/* Loan info content */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-full md:w-48 h-48 overflow-hidden rounded-xl shadow-lg">
            <img
              src={loan.image}
              alt={loan.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-3xl font-extrabold text-[#162660]">
              {loan.title}
            </h1>
            <p className="text-gray-700">{loan.shortDesc}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              <div className="p-3 rounded-xl shadow-xl border-2 border-[#162660]">
                <h3 className="text-[#162660] font-semibold">Category</h3>
                <p className="text-[#0B89A7]">{loan.category}</p>
              </div>
              <div className="rounded-xl shadow-xl border-2 border-[#162660] p-3">
                <h3 className="text-[#162660] font-semibold">Interest</h3>
                <p className="text-[#0B89A7]">{loan.interest}%</p>
              </div>
              <div className="rounded-xl shadow-xl border-2 border-[#162660] p-3">
                <h3 className="text-[#162660] font-semibold">Max Limit</h3>
                <p className="text-[#0B89A7]">
                  ৳ {loan.maxLimit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* EMI Plans */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-[#162660] mb-2">
            Available EMI Plans
          </h3>
          {loan.emiPlans && loan.emiPlans.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {loan.emiPlans.map((emi, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#D0E6FD] text-[#162660] font-medium rounded-full shadow hover:bg-[#162660] hover:text-white transition"
                >
                  {emi}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No EMI plans available</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {userInfo?.role === "borrower" ? (
            <button
              onClick={handleApply}
              className="w-full md:w-1/2 py-3 bg-[#162660] text-white font-bold rounded-xl shadow-lg hover:bg-[#0B89A7] transition"
            >
              Apply Now
            </button>
          ) : (
            <button
              disabled
              className="w-full md:w-1/2 py-3 bg-gray-300 text-gray-600 font-bold rounded-xl cursor-not-allowed"
            >
              Apply Now (Borrowers Only)
            </button>
          )}
          <button
            onClick={() => navigate("/loans")}
            className="w-full md:w-1/2 py-3 border-2 border-[#162660] text-[#162660] font-semibold rounded-xl hover:bg-[#D0E6FD] transition"
          >
            Back to All Loans
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsPage;
