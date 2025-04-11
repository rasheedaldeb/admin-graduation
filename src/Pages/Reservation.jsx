import React from "react";
import SideBar from "../Components/SideBar";
import ReservedPosts from "../Components/ReservedPosts";

const Reservation = () => {
  return (
    <div className="flex justify-between">
      <SideBar />
      <div className="flex w-[75%] flex-col gap-10 py-10">
        <ReservedPosts />
      </div>
    </div>
  );
};

export default Reservation;
