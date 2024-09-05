import { useAuthContext } from "@/context/authContext";
import Link from "next/link";
import UserAvatar from "../ui/user-avatar";
import UserQuery from "./user-query";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav
      className={`flex justify-between items-center bg-blue-500 sticky top-0 test:bg-blue-700 p-2 z-30 ${className}`}
    >
      {/* Left */}
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"}>
          <h1 className="text-2xl text-white font-bold py-1 font-[Pacifico]">Socially</h1>
        </Link>

        {/* Middle */}
        <UserQuery />

        {/* Right */}
        <div className="flex items-center gap-x-8">
          <div className="flex items-center gap-x-3">
            <UserAvatar isProfile={true} name={user.name ?? ""} />
            <span className="text-white">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-500 hover:bg-blue-100 hover:text-blue-600 px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
