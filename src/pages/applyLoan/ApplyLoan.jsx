import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { TbFidgetSpinner } from "react-icons/tb";

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input
      {...props}
      className="mt-1 w-full rounded-xl border border-gray-200 
      bg-gray-50 px-4 py-3 outline-none
      focus:border-[#162660] focus:bg-white transition"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <textarea
      {...props}
      className="mt-1 w-full rounded-xl border border-gray-200 
      bg-gray-50 px-4 py-3 outline-none min-h-[100px]
      focus:border-[#162660] focus:bg-white transition"
    />
  </div>
);

const ApplyLoan = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [loan, setLoan] = useState(null);
  const [loadingLoan, setLoadingLoan] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch loan info
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/loans/${loanId}`)
      .then((res) => setLoan(res.data))
      .catch(() => toast.error("Failed to load loan"))
      .finally(() => setLoadingLoan(false));
  }, [loanId]);

  const onSubmit = async (data) => {
    const applicationData = {
      ...data,
      loanId,
      loanTitle: loan.title,
      interestRate: loan.interest,
      userEmail: user.email,
      status: "Pending",
      applicationFeeStatus: "unpaid",
      createdAt: new Date(),
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/loan-applications`,
        applicationData
      );
      toast.success("Loan application submitted!");
      navigate("/dashboard/my-loans");
    } catch (error) {
      toast.error("Failed to submit application");
    }
  };

  if (loading || loadingLoan || !user || !loan) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <TbFidgetSpinner className="animate-spin text-5xl text-[#162660]" />
      </div>
    );
  }

  if (loading || !user || loadingLoan) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <TbFidgetSpinner className="animate-spin text-5xl text-[#162660]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D0E6FD] to-[#F1E4D1] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#162660] text-white p-8">
          <h2 className="text-3xl font-bold">Loan Application</h2>
          <p className="text-sm opacity-80 mt-1">
            Please review the loan details and submit your information
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
          {/* Auto Filled Section */}
          <section>
            <h3 className="text-lg font-semibold text-[#162660] mb-4">
              Loan Information
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Email" value={user.email} readOnly />
              <Input label="Loan Title" value={loan.title} readOnly />
              <Input
                label="Interest Rate"
                value={`${loan.interest}%`}
                readOnly
              />
            </div>
          </section>

          {/* Personal Info */}
          <section>
            <h3 className="text-lg font-semibold text-[#162660] mb-4">
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register("firstName", { required: true })}
              />
              <Input
                label="Last Name"
                {...register("lastName", { required: true })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Contact Number"
                {...register("contactNumber", { required: true })}
              />
              <Input
                label="NID / Passport"
                {...register("nidOrPassport", { required: true })}
              />
            </div>
          </section>

          {/* Financial Info */}
          <section>
            <h3 className="text-lg font-semibold text-[#162660] mb-4">
              Financial Details
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Income Source"
                {...register("incomeSource", { required: true })}
              />
              <Input
                label="Monthly Income"
                type="number"
                {...register("monthlyIncome", { required: true })}
              />
              <Input
                label="Loan Amount"
                type="number"
                {...register("loanAmount", { required: true })}
              />
            </div>
          </section>

          {/* Additional Info */}
          <section>
            <h3 className="text-lg font-semibold text-[#162660] mb-4">
              Additional Information
            </h3>

            <Textarea
              label="Reason for Loan"
              {...register("reason", { required: true })}
            />

            <Textarea
              label="Address"
              {...register("address", { required: true })}
            />

            <Textarea label="Extra Notes (Optional)" {...register("notes")} />
          </section>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-bold text-lg text-white 
            bg-gradient-to-r from-[#162660] to-[#0B89A7]
            hover:scale-[1.01] active:scale-95 transition-transform shadow-xl"
            >
              {isSubmitting ? "Submitting..." : "Submit Loan Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLoan;
