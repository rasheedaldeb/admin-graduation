import ComplaintSection from "../Components/ComplaintSection";
import SideBar from "../Components/SideBar";

const Complaint = () => {
  return (
    <div className="flex items-center justify-between">
      <SideBar />
      <div className="flex w-[70%] flex-col gap-10 py-10">
        <ComplaintSection />
      </div>
    </div>
  );
};

export default Complaint;
