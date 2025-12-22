import { useEffect, useState } from "react";
import axios from "../../../../axiosConfig";
import Swal from "sweetalert2";
import PageTitle from "../../../components/PageTitle";

const AdminAllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLoan, setEditLoan] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/loans");
      setLoans(res.data);
    } catch (err) {
      console.error("Failed to fetch loans:", err);
      Swal.fire("Error", "Failed to fetch loans", "error");
    }
    setLoading(false);
  };

  const toggleShowOnHome = async (loan) => {
    try {
      await axios.put(`http://localhost:5000/loans/${loan._id}`, {
        showOnHome: !loan.showOnHome,
      });
      fetchLoans();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update visibility", "error");
    }
  };

  const deleteLoan = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This loan will be permanently deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/loans/${id}`);
        Swal.fire("Deleted", "Loan deleted successfully", "success");
        fetchLoans();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete loan", "error");
      }
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: editLoan.title,
        shortDesc: editLoan.shortDesc,
        category: editLoan.category,
        image: editLoan.image,
        showOnHome: Boolean(editLoan.showOnHome),

        interest: Number(editLoan.interest),
        interestRate: Number(editLoan.interest), // keep in sync
        maxLimit: Number(editLoan.maxLimit),

        emiPlans: Array.isArray(editLoan.emiPlans)
          ? editLoan.emiPlans
          : editLoan.emiPlans
          ? editLoan.emiPlans.split(",").map((p) => p.trim())
          : [],
      };

      await axios.put(`http://localhost:5000/loans/${editLoan._id}`, payload);

      Swal.fire("Updated", "Loan updated globally", "success");
      setEditLoan(null);
      fetchLoans();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Database update failed", "error");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 md:p-6">
      <PageTitle title="All Loans"></PageTitle>
      <h1 className="text-2xl md:text-3xl font-bold mb-5">All Loans</h1>

      {/* ---------- DESKTOP TABLE ---------- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-[#162660] text-white">
            <tr>
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Interest</th>
              <th className="p-2">Category</th>
              <th className="p-2">Created By</th>
              <th className="p-2">Show on Home</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id} className="border-t text-center">
                <td className="p-2">
                  <img
                    src={loan.image}
                    alt=""
                    className="w-16 h-12 object-cover mx-auto rounded"
                  />
                </td>
                <td className="p-2">{loan.title}</td>
                <td className="p-2">{loan.interest}%</td>
                <td className="p-2">{loan.category}</td>
                <td className="p-2">{loan.createdBy || "Admin"}</td>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={loan.showOnHome || false}
                    onChange={() => toggleShowOnHome(loan)}
                  />
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => setEditLoan(loan)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteLoan(loan._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- MOBILE CARDS ---------- */}
      <div className="md:hidden space-y-4">
        {loans.map((loan) => (
          <div
            key={loan._id}
            className="bg-white p-4 rounded-xl shadow flex flex-col gap-2"
          >
            <img
              src={loan.image}
              alt=""
              className="w-full h-40 object-cover rounded"
            />
            <p className="font-semibold text-lg">{loan.title}</p>
            <p>Interest: {loan.interest}%</p>
            <p>Category: {loan.category}</p>
            <p>Created By: {loan.createdBy || "Admin"}</p>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={loan.showOnHome || false}
                  onChange={() => toggleShowOnHome(loan)}
                />
                Show on Home
              </label>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setEditLoan(loan)}
                className="flex-1 bg-blue-500 text-white py-1 rounded"
              >
                Update
              </button>
              <button
                onClick={() => deleteLoan(loan._id)}
                className="flex-1 bg-red-500 text-white py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- EDIT MODAL ---------- */}
      {editLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Loan</h2>

            <input
              value={editLoan.title}
              onChange={(e) =>
                setEditLoan({ ...editLoan, title: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Title"
            />

            <textarea
              value={editLoan.shortDesc || ""}
              onChange={(e) =>
                setEditLoan({ ...editLoan, shortDesc: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Short Description"
              rows={3}
            />

            <input
              type="number"
              value={editLoan.interest || ""}
              onChange={(e) =>
                setEditLoan({ ...editLoan, interest: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Interest Rate (%)"
            />

            <input
              value={editLoan.category || ""}
              onChange={(e) =>
                setEditLoan({ ...editLoan, category: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Category"
            />

            <input
              value={editLoan.image || ""}
              onChange={(e) =>
                setEditLoan({ ...editLoan, image: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Image URL"
            />

            <input
              type="number"
              value={editLoan.maxLimit || ""}
              onChange={(e) =>
                setEditLoan({ ...editLoan, maxLimit: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Max Loan Limit"
            />

            <input
              value={editLoan.emiPlans?.join(", ") || ""}
              onChange={(e) =>
                setEditLoan({
                  ...editLoan,
                  emiPlans: e.target.value.split(",").map((p) => p.trim()),
                })
              }
              className="w-full border p-2 mb-2"
              placeholder="EMI Plans (6 Months, 12 Months, 24 Months)"
            />

            <div className="flex flex-col md:flex-row justify-end gap-2 mt-4">
              <button
                onClick={() => setEditLoan(null)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllLoans;
