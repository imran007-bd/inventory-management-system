import React from "react";
import Container from "../Container";
import DashboardStats from "../dashboard/DashboardStats";
import PendingApprovals from "../dashboard/PendingApprovals";

const AdminDashboard = () => {
  return (
    <Container>
      <h1 className="lg:text-4xl text-[#0C2B4E] font-bold">Dashboard</h1>
      <p className="lg:text-xl text-[#0C2B4E]">Overview of your inventory and sales</p>

      <DashboardStats />
      <PendingApprovals />
    </Container>
  );
};

export default AdminDashboard;
