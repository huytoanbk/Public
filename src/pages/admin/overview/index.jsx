import React, { useState } from "react";
import UserStatsChart from "./UserStatsChart";
import MembershipChart from "./MemberShipChart";
import PostTypeChart from "./PostTypeChart";
import CommentAndLikeChart from "./CommentAndLikeChart";
import TopPosts from "./TopPosts";

const AdminOverview = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between gap-x-5 mb-8">
        <div className="flex-1">
          <UserStatsChart />
        </div>
        <div className="flex-1">
          <MembershipChart />
        </div>
      </div>
      <div className="flex items-center justify-between gap-x-5">
        <div className="flex-1">
          <PostTypeChart />
        </div>
        <div className="flex-1">
          <CommentAndLikeChart />
        </div>
      </div>
      <div className="flex items-center justify-between gap-x-5">
        <div className="flex-1">
        <TopPosts />
        </div>
        <div className="flex-1">
          {/* <CommentAndLikeChart /> */}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
