import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { TbFidgetSpinner } from "react-icons/tb";

const ApprovedApplicationsManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedLoans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/loan-applications`
      );

      const approved = res.data.filter((app) => app.status === "Approved");

      setApplications(approved);
    } catch (err) {
      Swal.fire("Error", "Failed to load approved loans", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedLoans();
  }, []);

  /* ---------- VIEW MODAL ---------- */
  const handleView = (loan) => {
    Swal.fire({
      title: "Approved Loan Details",
      html: `
        <div style="text-align:left;font-size:14px">
          <p><b>Loan ID:</b> ${loan._id}</p>
          <p><b>Borrower:</b> ${loan.userName || "N/A"}</p>
          <p><b>Email:</b> ${loan.userEmail}</p>
          <p><b>Loan Title:</b> ${loan.loanTitle}</p>
          <p><b>Amount:</b> $${loan.loanAmount}</p>
          <p><b>Approved On:</b> ${new Date(
            loan.approvedAt
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
        Approved Loan Applications
      </h2>

      {applications.length === 0 ? (
        <p className="text-gray-600">No approved loan applications.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg">
            <thead className="bg-[#162660] text-white">
              <tr>
                <th className="p-3">Loan ID</th>
                <th className="p-3">User Info</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Approved Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((loan) => (
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
                    {loan.approvedAt
                      ? new Date(loan.approvedAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleView(loan)}
                      className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
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

export default ApprovedApplicationsManager;
