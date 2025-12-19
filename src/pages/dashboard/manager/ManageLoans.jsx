import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";

const ManageLoans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    const res = await axios.get(
      `http://localhost:5000/loans/manager/${user.email}`
    );
    setLoans(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Loan?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(`http://localhost:5000/loans/${id}`);
    Swal.fire("Deleted", "Loan removed", "success");
    fetchLoans();
  };

  /* ---------------- SEARCH ---------------- */
  const filteredLoans = loans.filter(
    (loan) =>
      loan.title.toLowerCase().includes(search.toLowerCase()) ||
      loan.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#162660]">Manage Loans</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by title or category"
        className="mb-4 w-full md:w-1/3 border px-4 py-2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-[#162660] text-white">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Interest</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLoans.map((loan) => (
              <tr key={loan._id} className="border-t text-center">
                <td className="p-2">
                  <img
                    src={loan.image}
                    alt={loan.title}
                    className="w-16 h-12 object-cover mx-auto rounded"
                  />
                </td>
                <td className="p-2">{loan.title}</td>
                <td className="p-2">{loan.interestRate}%</td>
                <td className="p-2">{loan.category}</td>
                <td className="p-2 space-x-2">
                  <Link
                    to={`/dashboard/update-loan/${loan._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(loan._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredLoans.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No loans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLoans;
