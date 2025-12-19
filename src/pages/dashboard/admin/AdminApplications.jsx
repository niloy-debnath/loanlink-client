import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState("Pending");

  // Fetch all loan applications

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/loan-applications"); // <-- All applications
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      Swal.fire("Error", "Failed to fetch applications", "error");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter applications by status
  useEffect(() => {
    const filtered = applications.filter((app) => app.status === filter);
    console.log(filtered);
    setFilteredApps(filtered);
  }, [applications, filter]);

  // Approve / Reject handler
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/loan-applications/${id}/status`, {
        status,
      });

      Swal.fire("Success", `Application ${status}`, "success");
      fetchApplications(); // refresh table
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Loan Applications</h1>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          className="p-1 rounded border"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {filteredApps.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-[#162660] text-white">
              <tr>
                <th className="px-4 py-2">Loan ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Loan Category</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app._id} className="text-center border-t">
                  <td className="px-4 py-2">{app._id}</td>
                  <td className="px-4 py-2">{app.userEmail}</td>
                  <td className="px-4 py-2">{app.loanCategory}</td>
                  <td className="px-4 py-2">${app.loanAmount}</td>
                  <td className="px-4 py-2">{app.status}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center gap-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        View
                      </button>

                      {app.status === "Pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(app._id, "Approved")}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(app._id, "Rejected")}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-96 relative">
            <h2 className="text-xl font-bold mb-4">Application Details</h2>
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
            >
              ✖
            </button>
            <div className="space-y-2">
              <p>
                <strong>Loan Title:</strong> {selectedApp.loanTitle}
              </p>
              <p>
                <strong>User Email:</strong> {selectedApp.userEmail}
              </p>
              <p>
                <strong>First Name:</strong> {selectedApp.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedApp.lastName}
              </p>
              <p>
                <strong>Contact:</strong> {selectedApp.contactNumber}
              </p>
              <p>
                <strong>National ID / Passport:</strong>{" "}
                {selectedApp.nationalId}
              </p>
              <p>
                <strong>Income Source:</strong> {selectedApp.incomeSource}
              </p>
              <p>
                <strong>Monthly Income:</strong> {selectedApp.monthlyIncome}
              </p>
              <p>
                <strong>Loan Amount:</strong> {selectedApp.loanAmount}
              </p>
              <p>
                <strong>Reason for Loan:</strong> {selectedApp.reason}
              </p>
              <p>
                <strong>Address:</strong> {selectedApp.address}
              </p>
              <p>
                <strong>Extra Notes:</strong> {selectedApp.extraNotes}
              </p>
              <p>
                <strong>Status:</strong> {selectedApp.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
