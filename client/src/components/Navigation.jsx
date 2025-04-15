import React from "react";
import { Link } from "@heroui/react";
import { useLocation } from "react-router-dom";
import HomeIcon from "../assets/images/home.svg";
import AllEntriesIcon from "../assets/images/all-entries.svg";
import LogoutIcon from "../assets/images/logout.svg";
import NewEntryIcon from "../assets/images/new-entry.svg";

export default function Navigation() {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { label: "New Entry", href: "/new-entry", icon: NewEntryIcon },
    { label: "All Entries", href: "/all-entries", icon: AllEntriesIcon },
    { label: "Log Out", href: "/login", icon: LogoutIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-20">
      <nav className="bg-[#bae0b6] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 max-w-[400px] w-full">
        <div className="flex justify-between items-center">
          {menuItems.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              href={item.href}
              className="flex flex-col items-center text-black"
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-6 h-6 opacity-100"
              />
              <span className="text-xs font-light font-figtree">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
