import React from "react";
import HomeIcon from "../assets/images/home.svg";
import AllEntriesIcon from "../assets/images/all-entries.svg";
import LogoutIcon from "../assets/images/logout.svg";
import PageTransition from "../components/PageTransition";
import NewEntryIcon from "../assets/images/new-entry.svg";
import { Link } from "@heroui/react";

export default function Navigation() {
  const menuItems = [
    { label: "Dashboard", href: "/", icon: HomeIcon },
    { label: "New Entry", href: "/new-entry", icon: NewEntryIcon },
    { label: "All Entries", href: "/all-entries", icon: AllEntriesIcon },
    { label: "Log Out", href: "/login", icon: LogoutIcon },
  ];

  return (
    <PageTransition>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-20">
        <nav className="bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 max-w-[400px] w-full">
          <div className="flex justify-between items-center">
            {menuItems.map((item, index) => (
              <Link
                key={`${item.label}-${index}`}
                href={item.href}
                className="flex flex-col items-center"
              >
                <img src={item.icon} alt={item.label} className="w-6 h-6 " />
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </PageTransition>
  );
}
