import { Mail, Phone, MapPin } from "lucide-react";
import PageTitle from "../components/PageTitle";

const Contact = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-[#D0E6FD] to-[#F1E4D1]">
      <PageTitle title="Contact"></PageTitle>
      {/* Header */}
      <div className="bg-[#162660] text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Loan Link
          </h1>
          <p className="text-[#D0E6FD] max-w-2xl">
            Reach out for support, partnerships, or loan-related queries.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-14">
        {/* Info */}
        <div className="space-y-6">
          <Info icon={<Phone />} title="Phone" value="+880 1XXX-XXXXXX" />
          <Info icon={<Mail />} title="Email" value="support@loanlink.com" />
          <Info icon={<MapPin />} title="Address" value="Dhaka, Bangladesh" />

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-[#162660] mb-2">
              Business Hours
            </h3>
            <p className="text-gray-600">Sunday – Thursday</p>
            <p className="text-gray-600">9:00 AM – 6:00 PM</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-2xl font-semibold text-[#162660] mb-8">
            Send Us a Message
          </h2>

          <form className="space-y-6">
            <input
              className="w-full border-b-2 border-gray-200 focus:border-[#162660] outline-none py-3"
              placeholder="Full Name"
            />
            <input
              className="w-full border-b-2 border-gray-200 focus:border-[#162660] outline-none py-3"
              placeholder="Email Address"
            />
            <textarea
              rows="4"
              className="w-full border-b-2 border-gray-200 focus:border-[#162660] outline-none py-3"
              placeholder="Your Message"
            />
            <button className="w-full bg-[#162660] text-white py-4 rounded-xl text-lg font-medium hover:opacity-90 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Info = ({ icon, title, value }) => (
  <div className="flex items-start gap-4 bg-white p-6 rounded-3xl shadow-lg">
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#162660]/10 text-[#162660]">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-[#162660]">{title}</h4>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);

export default Contact;
