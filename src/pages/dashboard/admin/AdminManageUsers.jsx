import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suspendUser, setSuspendUser] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      Swal.fire("Error", "Failed to fetch users", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user role
  const updateRole = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:5000/users/${userId}/role`, {
        role: newRole,
      });
      Swal.fire("Success", "User role updated", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  // Suspend/Un-suspend handler
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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to unsuspend user", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
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
            {users.map((user) => (
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
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => setSuspendUser(user)}
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
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

      {/* Suspend Modal */}
      {suspendUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-96 relative">
            <h2 className="text-xl font-bold mb-4">Suspend User</h2>
            <button
              onClick={() => setSuspendUser(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
            >
              ✖
            </button>
            <p className="mb-2">
              Reason for suspending <strong>{suspendUser.name}</strong>:
            </p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="w-full border rounded p-2 mb-4"
              rows={4}
            ></textarea>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleSuspend}
            >
              Confirm Suspend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageUsers;
