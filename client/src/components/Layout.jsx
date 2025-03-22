import React from "react";
import Navigation from "./Navigation";

function Layout({ children }) {
  return (
    <div className="layout">
      <main className="main-content">{children}</main>
      <Navigation />
    </div>
  );
}
export default Layout;
