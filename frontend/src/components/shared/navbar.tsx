import { useAuthContext } from "@/context/authContext";
import Link from "next/link";
import UserAvatar from "../ui/user-avatar";
import UserQuery from "./usre-query";
interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user, isAuthenticated, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={`bg-blue-500 test:bg-blue-700 p-2 z-30 ${className}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"}>
          <h1 className="text-2xl text-white font-bold py-1 font-[Pacifico]">Socially</h1>
        </Link>

        {/* <UserQuery /> */}

        {isAuthenticated ? (
          <div className="flex items-center gap-x-8">
            <div className="flex items-center gap-x-3">
              <UserAvatar isProfile={true} name={user.name ?? ""} />
              <span className="text-white">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-500 hover:bg-blue-100 hover:text-blue-600 px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href={"/signin"}>
            <button className="bubble bg-white text-blue-500 px-4 py-2 rounded text-sm">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
