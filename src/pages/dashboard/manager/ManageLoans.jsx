import { useEffect, useState } from "react";
import axios from "../../../../axiosConfig";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import PageTitle from "../../../components/PageTitle";

const ManageLoans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/loans/manager/${user.email}`
      );
      setLoans(res.data);
    } catch {
      Swal.fire("Error", "Failed to load loans", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchLoans();
  }, [user]);

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

    await axios.delete(`${import.meta.env.VITE_API_URL}/loans/${id}`);
    Swal.fire("Deleted", "Loan removed successfully", "success");
    fetchLoans();
  };

  const handleEdit = async (loan) => {
    const { value } = await Swal.fire({
      title: "Update Loan",
      html: `
        <input id="title" class="swal2-input" value="${loan.title}" />
        <input id="interestRate" type="number" class="swal2-input" value="${
          loan.interestRate
        }" />
        <input id="category" class="swal2-input" value="${loan.category}" />
        <input id="maxLimit" type="number" class="swal2-input" value="${
          loan.maxLimit
        }" />
        <input id="image" class="swal2-input" value="${loan.image}" />
        <label style="display:flex;gap:8px;margin-top:10px">
          <input id="showOnHome" type="checkbox" ${
            loan.showOnHome ? "checked" : ""
          }/>
          Show on Home
        </label>
      `,
      preConfirm: () => ({
        title: document.getElementById("title").value,
        interestRate: document.getElementById("interestRate").value,
        category: document.getElementById("category").value,
        maxLimit: document.getElementById("maxLimit").value,
        image: document.getElementById("image").value,
        showOnHome: document.getElementById("showOnHome").checked,
      }),
      showCancelButton: true,
    });

    if (!value) return;

    await axios.put(`${import.meta.env.VITE_API_URL}/${loan._id}`, value);
    Swal.fire("Updated", "Loan updated successfully", "success");
    fetchLoans();
  };

  const filteredLoans = loans.filter(
    (loan) =>
      loan.title.toLowerCase().includes(search.toLowerCase()) ||
      loan.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 sm:p-6">
      <PageTitle title="Manage Loans"></PageTitle>
      <h1 className="text-2xl font-bold mb-4 text-[#162660]">Manage Loans</h1>

      <input
        type="text"
        placeholder="Search by title or category"
        className="mb-4 w-full sm:w-2/3 md:w-1/3 border px-4 py-2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ---------------- DESKTOP TABLE ---------------- */}
      <div className="hidden md:block overflow-x-auto">
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
          </tbody>
        </table>
      </div>

      {/* ---------------- MOBILE CARDS ---------------- */}
      <div className="md:hidden space-y-4">
        {filteredLoans.map((loan) => (
          <div
            key={loan._id}
            className="bg-white shadow rounded-lg p-4 flex gap-4"
          >
            <img
              src={loan.image}
              alt={loan.title}
              className="w-20 h-16 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{loan.title}</h3>
              <p className="text-sm">Interest: {loan.interestRate}%</p>
              <p className="text-sm">Category: {loan.category}</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(loan)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(loan._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredLoans.length === 0 && (
          <p className="text-center text-gray-500">No loans found</p>
        )}
      </div>
    </div>
  );
};

export default ManageLoans;
