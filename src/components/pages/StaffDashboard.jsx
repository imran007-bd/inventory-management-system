import React from "react";
import Container from "../Container";
import DashboardStats from "../dashboard/DashboardStats";

const StaffDashboard = () => {
  return (
    <Container>
      <h1 className="lg:text-4xl text-[#0C2B4E] font-bold">Dashboard</h1>
      <p className="lg:text-xl text-[#0C2B4E]">Overview of products and stock levels</p>

      <DashboardStats scope="stock" />
    </Container>
  );
};

export default StaffDashboard;
