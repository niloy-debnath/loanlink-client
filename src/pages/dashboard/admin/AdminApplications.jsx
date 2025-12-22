import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PageTitle from "../../../components/PageTitle";

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
      const res = await axios.get("http://localhost:5000/loan-applications");
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
      <div className="flex justify-center items-center h-full p-6">
        Loading...
      </div>
    );

  return (
    <div className="p-4 md:p-6">
      <PageTitle title="All Applications"></PageTitle>
      <h1 className="text-2xl md:text-3xl font-bold mb-5">Loan Applications</h1>

      {/* Filter */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2">
        <label className="font-semibold">Filter by Status:</label>
        <select
          className="p-1 rounded border w-full md:w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* ---------- DESKTOP TABLE ---------- */}
      <div className="hidden md:block overflow-x-auto">
        {filteredApps.length === 0 ? (
          <p>No applications found.</p>
        ) : (
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
                    <div className="flex justify-center items-center gap-2 flex-wrap">
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
        )}
      </div>

      {/* ---------- MOBILE CARDS ---------- */}
      <div className="md:hidden space-y-4">
        {filteredApps.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded-xl shadow flex flex-col gap-2"
            >
              <p>
                <strong>Loan ID:</strong> {app._id}
              </p>
              <p>
                <strong>User:</strong> {app.userEmail}
              </p>
              <p>
                <strong>Category:</strong> {app.loanCategory}
              </p>
              <p>
                <strong>Amount:</strong> ${app.loanAmount}
              </p>
              <p>
                <strong>Status:</strong> {app.status}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => setSelectedApp(app)}
                  className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
                {app.status === "Pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(app._id, "Approved")}
                      className="flex-1 bg-green-500 text-white py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(app._id, "Rejected")}
                      className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---------- MODAL ---------- */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Application Details</h2>
            <div className="space-y-2 text-sm">
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
