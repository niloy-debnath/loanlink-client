import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import PageTitle from "../../../components/PageTitle";

const AddLoanManager = () => {
  const { user } = useAuth();
  const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    interestRate: "",
    maxLimit: "",
    emiPlans: "",
    requiredDocuments: "",
    showOnHome: false,
  });

  const [imageFile, setImageFile] = useState(null); // 🔹 NEW

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      return Swal.fire("Error", "Please upload an image", "error");
    }

    try {
      setLoading(true);

      /* ---------------- IMAGE UPLOAD ---------------- */
      const imageData = new FormData();
      imageData.append("image", imageFile);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        imageData
      );

      const imageUrl = imgRes.data.data.display_url;

      /* ---------------- LOAN DATA ---------------- */
      const loanData = {
        title: form.title,
        description: form.description,
        category: form.category,
        interestRate: Number(form.interestRate),
        maxLimit: Number(form.maxLimit),
        emiPlans: form.emiPlans.split(",").map((p) => p.trim()),
        requiredDocuments: form.requiredDocuments
          .split(",")
          .map((d) => d.trim()),
        image: imageUrl,
        showOnHome: form.showOnHome,
        createdBy: user.email,
        createdAt: new Date(),
      };

      await axios.post("http://localhost:5000/loans", loanData);

      Swal.fire("Success", "Loan added successfully", "success");
      e.target.reset();
      setImageFile(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add loan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6  min-h-screen">
      <PageTitle title="Add Loan"></PageTitle>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-[#162660]">
            Add New Loan Product
          </h1>
          <p className="text-sm text-gray-500">
            Fill in the details carefully. This loan will be visible to users
            after approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC INFO */}
          <section>
            <h2 className="text-lg font-semibold text-[#162660] mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Loan Title"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Input
                label="Category"
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div className="mt-4">
              <Textarea
                label="Loan Description"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </section>

          {/* FINANCIAL INFO */}
          <section>
            <h2 className="text-lg font-semibold text-[#162660] mb-4">
              Financial Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="number"
                label="Interest Rate (%)"
                onChange={(e) =>
                  setForm({ ...form, interestRate: e.target.value })
                }
              />
              <Input
                type="number"
                label="Maximum Loan Limit"
                onChange={(e) => setForm({ ...form, maxLimit: e.target.value })}
              />
            </div>
          </section>

          {/* CONFIGURATION */}
          <section>
            <h2 className="text-lg font-semibold text-[#162660] mb-4">
              Loan Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="EMI Plans (comma separated)"
                onChange={(e) => setForm({ ...form, emiPlans: e.target.value })}
              />
              <Input
                label="Required Documents (comma separated)"
                onChange={(e) =>
                  setForm({ ...form, requiredDocuments: e.target.value })
                }
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Loan Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>
          </section>

          {/* VISIBILITY */}
          <section className="flex items-center gap-3 bg-[#D0E6FD] p-4 rounded-lg">
            <input
              type="checkbox"
              className="w-5 h-5"
              onChange={(e) =>
                setForm({ ...form, showOnHome: e.target.checked })
              }
            />
            <div>
              <p className="font-medium text-[#162660]">Show on Home Page</p>
              <p className="text-sm text-gray-600">
                Highlight this loan in the Home “Available Loans” section
              </p>
            </div>
          </section>

          {/* ACTION BUTTON */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-[#162660] text-white font-semibold hover:bg-[#1f3380] transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Loan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLoanManager;

/* ---------- Reusable Components ---------- */

const Input = ({ label, type = "text", onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#162660]"
      required
    />
  </div>
);

const Textarea = ({ label, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      onChange={onChange}
      rows="4"
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#162660]"
      required
    />
  </div>
);
