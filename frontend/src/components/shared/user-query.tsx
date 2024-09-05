import Link from "next/link";
import UserAvatar from "../ui/user-avatar";
import { userService } from "@/data/user.service";
import { Loader } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";

const UserQuery: React.FC<{}> = ({}) => {
  const [query, setQuery] = useState<string>("");
  const { users, isLoading, error } = userService.useSearchUsers(query);

  return (
    <div className="max-sm:hidden relative">
      {/* Form */}
      <form action="">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full"
        />
      </form>
      {/* User List */}
      {isLoading ? (
        <div className="flex items-center justify-center absolute h-20 w-80 -left-2 bg-slate-100 rounded-xl border-2 border-blue-300">
          <Loader className="animate-spin h-5 w-5 text-gray-500" />
        </div>
      ) : users && users.length > 0 ? (
        <div className="absolute animate-scale opacity-100 p-1 w-80 top-12 -left-2 rounded-xl bg-slate-100 border-2 border-blue-300">
          {users?.map(user => (
            <Link onClick={() => setQuery("")} key={user.id} href={`/users/${user.id}`}>
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
      ) : (
        <div className="text-gray-500"></div>
      )}
    </div>
  );
};

export default UserQuery;
