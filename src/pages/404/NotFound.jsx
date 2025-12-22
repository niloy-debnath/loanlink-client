import { Link } from "react-router";
import { TbArrowBackUp } from "react-icons/tb";
import notfoundimg from "../../assets/not-found-img.png";
import PageTitle from "../../components/PageTitle";
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-6">
      <PageTitle title="404"></PageTitle>
      {/* <h1 className="text-[10rem] font-bold text-[#162660]">404</h1> */}
      <img src={notfoundimg} alt="" />
      {/* <h2 className="text-3xl md:text-4xl font-semibold text-[#162660] mb-4">
        Page Not Found
      </h2> */}
      <p className="text-gray-700 -mt-20 mb-6 text-center max-w-md">
        The page you are looking for does not exist or has been moved. Please
        check the URL or return to the homepage.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 bg-[#162660] text-[#D0E6FD] px-6 py-3 rounded-lg font-semibold hover:bg-[#1f3380] transition"
      >
        <TbArrowBackUp className="text-xl" /> Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
