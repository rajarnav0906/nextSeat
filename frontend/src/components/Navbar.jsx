import logo from '../images/logo2.png';

export default function Navbar({ onMenuClick }) {
  return (
    <div className="flex justify-between items-center bg-gray-50 px-4 sm:px-6 lg:px-8 pt-4 pb-2 shadow-sm z-50">
      <img
        src={logo}
        alt="TravelMate Logo"
        className="h-14 lg:h-[60px] w-auto"
      />
      <button
        onClick={onMenuClick}
        className="block md:hidden text-[#4A90E2] p-2 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}
