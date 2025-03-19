import React from "react";
import {
  Navbar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  Link,
} from "@heroui/react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/" },
    { label: "New Entry", href: "/new-entry" },
    { label: "My Entries", href: "/all-entries" },
    { label: "Log Out", href: "/login" },
  ];

  return (
    <div
      className="nav-container"
      style={{ maxWidth: "440px", margin: "0 auto" }}
    >
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="max-w-[440px]"
      >
        <NavbarContent justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        <NavbarMenu className="navbar-menu-constrained">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                className="w-full text-[#A7CFB8]"
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
