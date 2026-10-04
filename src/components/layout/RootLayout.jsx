import React from "react";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";


const RootLayout = () => {
  const location = useLocation();

  // Paths where we don’t want header/footer
  const hideHeaderFooter = ["/login", "/register"];

  const shouldHide = hideHeaderFooter.includes(location.pathname);

  return (
    <>
    {!shouldHide && <Header />}
    <main className="ml-64 p-6 bg-gray-100 min-h-screen">
  <Outlet />
</main>
      
      
    </>
  );
};

export default RootLayout;
