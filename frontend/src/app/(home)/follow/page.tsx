"use client";
import UserCard from "@/components/shared/user-card";
import UserLoader from "@/components/shared/user-skeleton";
import Error from "@/components/ui/error";
import { userService } from "@/data/user.service";

function UserList() {
  const { users, isLoading, error } = userService.useAllUsers();

  if (isLoading) return <UserLoader />;
  if (error) return <Error />;

  return (
    <>
      <div className="bg-white test:bg-dark-200 rounded-md p-4 mt-3 shadow-md w-[550px] text-gray-700">
        <h2 className="">Friends</h2>
        <hr className="my-3" />
        {users?.length === 0 ? (
          <h2>No user available</h2>
        ) : (
          <ul>
            {users?.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </ul>
        )}
        {users && users?.length > 10 && (
          <div className="w-full bg-trasnsparent flex justify-center items-center text-black h-[20vh] mb-10">
            <img src="spinner.svg" alt="" />
          </div>
        )}
      </div>
    </>
  );
}

export default UserList;
