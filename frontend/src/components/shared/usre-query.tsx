import Link from "next/link";
import UserAvatar from "../ui/user-avatar";
import { userService } from "@/data/user.service";
import { Loader } from "lucide-react";

const UserQuery: React.FC<{}> = ({}) => {
  const { users, isLoading, error } = userService.useAllUsers();
  if (isLoading) return <Loader />;
  if (error) return <p>{error.message}</p>;
  if(!users) return;
  return (
    <div className="absolute animate-scale opacity-100 p-1 w-80 top-12 rounded-md bg-slate-100 border-2 border-blue-300">
      {users.map(user => (
        <Link key={user.id} href={`/user/${user.id}`}>
          <div className="flex items-center justify-between hover:bg-white hover:scale-105 hover:translate-x-1 rounded-md px-4 py-2 transition-all duration-200 cursor-pointer">
            <div className="flex items-center">
              <UserAvatar src={user.image} name={user.name} />
              <span className="text-gray-600 text-sm test:text-slate-200 ml-6">
                {user.name}
              </span>
            </div>
          </div>
          <hr />
        </Link>
      ))}
    </div>
  );
};

export default UserQuery;
