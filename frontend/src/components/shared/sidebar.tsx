import React from "react";
import { Home, User, MessageCircle, User as Profile, Bookmark } from "lucide-react";
import { useAuthContext } from "@/context/authContext";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarItem {
  href: string;
  icon: React.ReactElement;
  label: string;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const userId = user.id;

  const sidebarItems: SidebarItem[] = [
    {
      href: "/",
      icon: <Home style={{ fontSize: "1.5rem", color: "gray" }} />,
      label: "Home",
    },
    {
      href: "/follow",
      icon: <User style={{ fontSize: "1.5rem", color: "gray" }} />,
      label: "Follow",
    },
    {
      href: "/message",
      icon: <MessageCircle style={{ fontSize: "1.3rem", color: "gray" }} />,
      label: "Message",
    },
    {
      href: `/users/${userId}`,
      icon: <Profile style={{ fontSize: "1.6rem", color: "gray" }} />,
      label: "Profile",
    },
    {
      href: "/saved",
      icon: <Bookmark style={{ fontSize: "1.5rem", color: "gray" }} />,
      label: "Saved",
    },
  ];
  return (
    <div className="sidebar flex-1 sticky top-16 bg-white text-gray-700 appear-animation ml-2 rounded-md shadow-md w-64 pt-3 px-1  h-[87vh] max-[940px]:hidden">
      <ul className="flex flex-col gap-y-3">
        {sidebarItems.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={
              "w-full py-3 pl-5 hover:bg-slate-100 active:bg-slate-200 rounded-md flex gap-x-3 items-center hover:scale-105 transition-all hover:translate-x-2"
            }
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
