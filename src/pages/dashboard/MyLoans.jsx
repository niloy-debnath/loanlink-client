import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { TbFidgetSpinner } from "react-icons/tb";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const MyLoans = () => {
  const { user, loading } = useAuth();
  const [loans, setLoans] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [payingLoan, setPayingLoan] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  /* ================= FETCH LOANS ================= */
  const fetchLoans = async () => {
    if (!user) return;
    setFetching(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/loan-applications/user/${user.email}`
      );
      setLoans(res.data);
    } catch {
      toast.error("Failed to load your loans");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [user]);

  /* ================= VIEW LOAN ================= */
  const handleViewLoan = (loan) => {
    Swal.fire({
      title: "Loan Application Details",
      html: `
        <div style="text-align:left;font-size:14px">
          <p><b>Loan ID:</b> ${loan._id}</p>
          <p><b>Loan Title:</b> ${loan.loanTitle}</p>
          <p><b>Amount:</b> $${loan.loanAmount}</p>
          <p><b>Status:</b> ${loan.status}</p>
          <p><b>Application Fee:</b> ${loan.applicationFeeStatus}</p>
          <p><b>Income Source:</b> ${loan.incomeSource || "N/A"}</p>
          <p><b>Contact Number:</b> ${loan.contactNumber || "N/A"}</p>
          <p><b>NID / Passport:</b> ${loan.nidOrPassport || "N/A"}</p>
          <p><b>Applied At:</b> ${
            loan.createdAt ? new Date(loan.createdAt).toLocaleString() : "N/A"
          }</p>
        </div>
      `,
      confirmButtonText: "Close",
      confirmButtonColor: "#162660",
    });
  };

  /* ================= CANCEL ================= */
  const cancelApplication = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Application?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/loan-applications/${id}/cancel`
      );
      toast.success("Application cancelled");
      fetchLoans();
    } catch {
      toast.error("Failed to cancel application");
    }
  };

  /* ================= PAY ================= */
  const payFee = async () => {
    try {
      if (!stripe || !elements || !payingLoan) return;

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/loan-applications/${
          payingLoan._id
        }/pay`
      );

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { email: payingLoan.userEmail },
          },
        }
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/loan-applications/${
            payingLoan._id
          }/confirm-payment`
        );
        toast.success("Payment successful!");
        setPayingLoan(null);
        fetchLoans();
      }
    } catch {
      toast.error("Payment failed");
    }
  };

  if (loading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <TbFidgetSpinner className="animate-spin text-5xl text-[#162660]" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-[80vh]">
      <h2 className="text-3xl font-bold mb-6 text-[#162660]">
        My Loan Applications
      </h2>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow-lg">
          <thead className="bg-[#162660] text-white">
            <tr>
              <th className="p-3">Loan Info</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{loan.loanTitle}</td>
                <td className="p-3">${loan.loanAmount}</td>
                <td className="p-3">{loan.status}</td>
                <td className="p-3">{loan.applicationFeeStatus}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleViewLoan(loan)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    View
                  </button>

                  {loan.status === "Pending" && (
                    <button
                      onClick={() => cancelApplication(loan._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Cancel
                    </button>
                  )}

                  {loan.applicationFeeStatus === "Unpaid" ? (
                    <button
                      onClick={() => setPayingLoan(loan)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Pay $10
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded">
                      Paid
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* STRIPE MODAL */}
      {payingLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4">
              Pay $10 for {payingLoan.loanTitle}
            </h3>
            <CardElement className="p-3 border rounded mb-4" />
            <div className="flex gap-3">
              <button
                onClick={payFee}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Pay
              </button>
              <button
                onClick={() => setPayingLoan(null)}
                className="flex-1 bg-gray-400 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLoans;
