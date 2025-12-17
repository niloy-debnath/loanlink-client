import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { TbFidgetSpinner } from "react-icons/tb";
import toast from "react-hot-toast";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const MyLoans = () => {
  const { user, loading } = useAuth();
  const [loans, setLoans] = useState([]);
  const [fetching, setFetching] = useState(true);

  // ✅ NEW: selected loan for payment (FIX)
  const [payingLoan, setPayingLoan] = useState(null);

  // Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  // Fetch loans
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

  // Cancel a pending loan
  const cancelApplication = async (id) => {
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

  // Pay $10 fee
  const payFee = async () => {
    try {
      if (!stripe || !elements || !payingLoan) {
        toast.error("Stripe is not ready");
        return;
      }

      // 1️⃣ Create payment intent
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/loan-applications/${
          payingLoan._id
        }/pay`
      );

      // 2️⃣ Confirm payment
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
        // 3️⃣ Update backend
        await axios.post(
          `${import.meta.env.VITE_API_URL}/loan-applications/${
            payingLoan._id
          }/confirm-payment`
        );
        toast.success("Payment successful!");
        setPayingLoan(null);
        fetchLoans();
      }
    } catch (err) {
      console.error(err);
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
    <div className="p-6 bg-[#F1E4D1] min-h-[80vh]">
      <h2 className="text-3xl font-bold mb-6 text-[#162660]">
        My Loan Applications
      </h2>

      {loans.length === 0 ? (
        <p className="text-gray-600">You have not applied for any loans yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded-xl shadow-lg">
            <thead className="bg-[#162660] text-white">
              <tr>
                <th className="p-3">Loan Title</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Application Fee</th>
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
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      View
                    </button>

                    {loan.status === "Pending" && (
                      <button
                        onClick={() => cancelApplication(loan._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}

                    {loan.applicationFeeStatus === "Unpaid" && (
                      <button
                        onClick={() => setPayingLoan(loan)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Pay $10
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ SINGLE CardElement (FIXED) */}
      {payingLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Pay $10 for {payingLoan.loanTitle}
            </h3>

            <CardElement className="p-3 border rounded mb-4" />

            <div className="flex gap-3">
              <button
                onClick={payFee}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Pay Now
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
