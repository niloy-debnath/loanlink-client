import { NavLink } from "react-router";
import Logo from "../shared/Logo";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#162660] text-[#D0E6FD]">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Brand */}
        <div>
          <Logo />
          <p className="mt-3 text-xs text-[#D0E6FD]/75 leading-relaxed">
            Loan Link is a secure digital lending platform ensuring fast and
            transparent loan services.
          </p>

          <div className="flex gap-3 mt-4">
            <SocialIcon icon={<FaFacebookF />} />
            <SocialIcon icon={<FaLinkedinIn />} />
            <SocialIcon icon={<FaTwitter />} />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footer-title-sm">Quick Links</h4>
          <ul className="footer-list-sm">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>Loans</li>
            <li>Apply</li>
            <li>Dashboard</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="footer-title-sm">Services</h4>
          <ul className="footer-list-sm">
            <li>Personal</li>
            <li>Business</li>
            <li>Education</li>
            <li>Secure Pay</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="footer-title-sm">Contact</h4>
          <ul className="space-y-2 text-xs text-[#D0E6FD]/80">
            <li className="flex items-center gap-2">
              <FaEnvelope /> support@loanlink.com
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> +880 1234-567890
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[#D0E6FD]/20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row justify-between items-center text-xs text-[#D0E6FD]/60">
          <p>© {new Date().getFullYear()} Loan Link</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* Social Icon */
const SocialIcon = ({ icon }) => (
  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#D0E6FD]/10 hover:bg-[#0B89A7] text-white transition cursor-pointer">
    {icon}
  </span>
);

export default Footer;
