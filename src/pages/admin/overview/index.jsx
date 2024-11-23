import React, { useState } from "react";
import UserStatsChart from "./UserQuantity";

const AdminOverview = () => {
 
  return (
    <div className="container mx-auto py-8">
      <div>
        <UserStatsChart />
      </div>
    </div>
  );
};

export default AdminOverview;
