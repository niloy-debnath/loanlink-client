import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const ManageLoans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH LOANS ---------------- */
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/loans/manager/${user.email}`
      );
      setLoans(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load loans", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchLoans();
  }, [user]);

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
    Swal.fire("Deleted", "Loan removed successfully", "success");
    fetchLoans();
  };

  /* ---------------- UPDATE (MODAL) ---------------- */
  const handleEdit = async (loan) => {
    const { value: formValues } = await Swal.fire({
      title: "Update Loan",
      html: `
        <input id="title" class="swal2-input" placeholder="Title" value="${
          loan.title
        }" />
        <input id="interestRate" type="number" class="swal2-input" placeholder="Interest Rate" value="${
          loan.interestRate
        }" />
        <input id="category" class="swal2-input" placeholder="Category" value="${
          loan.category
        }" />
        <input id="maxLimit" type="number" class="swal2-input" placeholder="Max Limit" value="${
          loan.maxLimit
        }" />
        <input id="image" class="swal2-input" placeholder="Image URL" value="${
          loan.image
        }" />
        <label style="display:flex;align-items:center;gap:8px;margin-top:10px">
          <input id="showOnHome" type="checkbox" ${
            loan.showOnHome ? "checked" : ""
          } />
          Show on Home
        </label>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          title: document.getElementById("title").value,
          interestRate: document.getElementById("interestRate").value,
          category: document.getElementById("category").value,
          maxLimit: document.getElementById("maxLimit").value,
          image: document.getElementById("image").value,
          showOnHome: document.getElementById("showOnHome").checked,
        };
      },
      showCancelButton: true,
      confirmButtonText: "Update",
    });

    if (!formValues) return;

    try {
      await axios.put(`http://localhost:5000/loans/${loan._id}`, formValues);

      Swal.fire("Updated", "Loan updated successfully", "success");
      fetchLoans();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update loan", "error");
    }
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
                  <button
                    onClick={() => handleEdit(loan)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
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
