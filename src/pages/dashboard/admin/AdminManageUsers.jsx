import { useEffect, useState, useMemo } from "react";
import axios from "../../../../axiosConfig";
import Swal from "sweetalert2";
import PageTitle from "../../../components/PageTitle";

const USERS_PER_PAGE = 5;

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // suspend modal
  const [suspendUser, setSuspendUser] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");

  // search & filter
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------- FETCH USERS ---------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------- RESET PAGE ON FILTER CHANGE ---------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  /* ---------- ROLE UPDATE ---------- */
  const updateRole = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:5000/users/${userId}/role`, {
        role: newRole,
      });
      Swal.fire("Success", "User role updated", "success");
      fetchUsers();
    } catch {
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  /* ---------- SUSPEND ---------- */
  const handleSuspend = async () => {
    try {
      await axios.put(
        `http://localhost:5000/users/${suspendUser._id}/suspend`,
        {
          suspended: true,
          reason: suspendReason,
        }
      );
      Swal.fire("Success", "User suspended", "success");
      setSuspendUser(null);
      setSuspendReason("");
      fetchUsers();
    } catch {
      Swal.fire("Error", "Failed to suspend user", "error");
    }
  };

  const handleUnsuspend = async (user) => {
    try {
      await axios.put(`http://localhost:5000/users/${user._id}/suspend`, {
        suspended: false,
        reason: "",
      });
      Swal.fire("Success", "User unsuspended", "success");
      fetchUsers();
    } catch {
      Swal.fire("Error", "Failed to unsuspend user", "error");
    }
  };

  /* ---------- FILTER USERS ---------- */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !user.suspended) ||
        (statusFilter === "suspended" && user.suspended);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  /* ---------- PAGINATION LOGIC ---------- */
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <PageTitle title="Manage Users" />
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Manage Users</h1>

      {/* ---------- SEARCH & FILTER ---------- */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/4"
        >
          <option value="all">All Roles</option>
          <option value="borrower">Borrower</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/4"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* ---------- DESKTOP TABLE ---------- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-[#162660] text-white">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user._id} className="text-center border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user._id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="borrower">Borrower</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  {user.suspended ? "Suspended" : "Active"}
                </td>
                <td className="px-4 py-2 space-x-2">
                  {!user.suspended ? (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => setSuspendUser(user)}
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleUnsuspend(user)}
                    >
                      Unsuspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map((user) => (
          <div key={user._id} className="bg-white p-4 rounded-xl shadow">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Status:</strong> {user.suspended ? "Suspended" : "Active"}
            </p>
          </div>
        ))}
      </div>

      {/* ---------- PAGINATION UI ---------- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages).keys()].map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === n + 1 ? "bg-[#162660] text-white" : ""
              }`}
            >
              {n + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminManageUsers;
