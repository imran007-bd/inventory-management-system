import React from "react";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


const RootLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Paths where we don’t want header/footer
  const hideHeaderFooter = ["/login", "/register"];

  const shouldShowHeader =
    Boolean(user) && !hideHeaderFooter.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <main
        className={`${shouldShowHeader ? "ml-64" : ""} p-6 bg-gray-100 min-h-screen`}
      >
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
