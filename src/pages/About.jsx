import { ShieldCheck, TrendingUp, Landmark, Users } from "lucide-react";

const About = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#D0E6FD] via-white to-[#F1E4D1]">
      {/* Hero */}
      <div className="bg-[#162660] text-white py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Redefining Digital Lending
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-[#D0E6FD]">
          Loan Link is a modern loan management platform connecting borrowers
          with trusted banks through transparency, security, and speed.
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat value="25+" label="Bank Partners" />
          <Stat value="100+" label="Loan Products" />
          <Stat value="10k+" label="Active Users" />
          <Stat value="99.9%" label="Uptime" />
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10">
        <Card title="Our Mission">
          To simplify loan access through a secure, transparent, and user-first
          digital platform.
        </Card>
        <Card title="Our Vision">
          To become Bangladesh’s most trusted digital loan ecosystem.
        </Card>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#162660] mb-14">
          Why Choose Loan Link
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature icon={<ShieldCheck />} title="Bank-Grade Security" />
          <Feature icon={<Landmark />} title="Verified Institutions" />
          <Feature icon={<TrendingUp />} title="Smart Analytics" />
          <Feature icon={<Users />} title="Role-Based Access" />
        </div>
      </div>
    </section>
  );
};

const Stat = ({ value, label }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
    <h3 className="text-3xl font-bold text-[#162660]">{value}</h3>
    <p className="text-gray-600 mt-1">{label}</p>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white rounded-3xl shadow-xl p-10">
    <h3 className="text-2xl font-semibold text-[#162660] mb-4">{title}</h3>
    <p className="text-gray-700 leading-relaxed">{children}</p>
  </div>
);

const Feature = ({ icon, title }) => (
  <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition">
    <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-full bg-[#162660]/10 text-[#162660]">
      {icon}
    </div>
    <h4 className="font-semibold text-lg text-[#162660]">{title}</h4>
  </div>
);

export default About;
