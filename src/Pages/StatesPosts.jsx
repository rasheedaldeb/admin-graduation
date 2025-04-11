import React from "react";
import SideBar from "../Components/SideBar";
import TypeButtons from "../Components/TypeButtons";
import PostsByState from "../Components/PostsByState";
const StatesPosts = () => {
  return (
    <div className="flex justify-between">
      <SideBar />
      <div className="flex w-[75%] flex-col gap-10 py-10">
        <TypeButtons />
        <PostsByState />
      </div>
    </div>
  );
};

export default StatesPosts;
