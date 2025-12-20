import { useEffect, useState } from "react";
import axios from "axios";
import { TbFidgetSpinner } from "react-icons/tb";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const PendingLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/loan-applications/pending`
      );
      setLoans(res.data);
    } catch {
      toast.error("Failed to load pending loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  /* ---------- APPROVE / REJECT ---------- */
  const updateStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: `${status} Application?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: status,
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/loan-applications/${id}/status`,
        { status }
      );
      toast.success(`Application ${status}`);
      fetchLoans();
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ---------- VIEW MODAL ---------- */
  const handleView = (loan) => {
    Swal.fire({
      title: "Loan Application Details",
      html: `
        <div style="text-align:left;font-size:14px">
          <p><b>Loan ID:</b> ${loan._id}</p>
          <p><b>User Email:</b> ${loan.userEmail}</p>
          <p><b>Loan Title:</b> ${loan.loanTitle}</p>
          <p><b>Amount:</b> $${loan.loanAmount}</p>
          <p><b>Status:</b> ${loan.status}</p>
          <p><b>Applied On:</b> ${new Date(
            loan.createdAt
          ).toLocaleDateString()}</p>
        </div>
      `,
      confirmButtonText: "Close",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <TbFidgetSpinner className="animate-spin text-5xl text-[#162660]" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F1E4D1] min-h-[80vh]">
      <h2 className="text-3xl font-bold mb-6 text-[#162660]">
        Pending Loan Applications
      </h2>

      {loans.length === 0 ? (
        <p className="text-gray-600">No pending loan applications.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded-xl shadow-lg">
            <thead className="bg-[#162660] text-white">
              <tr>
                <th className="p-3">Loan ID</th>
                <th className="p-3">User Info</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id} className="border-b hover:bg-gray-100">
                  <td className="p-3 text-xs">{loan._id}</td>

                  <td className="p-3">
                    <p className="font-medium">
                      {loan.firstName && loan.lastName
                        ? `${loan.firstName} ${loan.lastName}`
                        : "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">{loan.userEmail}</p>
                  </td>

                  <td className="p-3">${loan.loanAmount}</td>

                  <td className="p-3">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleView(loan)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => updateStatus(loan._id, "Approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(loan._id, "Rejected")}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingLoans;
