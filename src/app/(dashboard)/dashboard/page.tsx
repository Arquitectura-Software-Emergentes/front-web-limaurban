"use client";

import React from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import IncidentsTable from "@/components/dashboard/IncidentsTable";

export default function DashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <StatsCards />
      <IncidentsTable />
    </div>
  );
}