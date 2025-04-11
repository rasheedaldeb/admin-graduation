import { useContext } from "react";
import { StatesContext } from "../Context/Context";

const TypeButtons = () => {
  const { type, setType } = useContext(StatesContext);
  return (
    <section className="flex items-center justify-center gap-30 px-10">
      <button
        onClick={() => setType("rejected")}
        className={`${type === "rejected" && "border-primary border bg-white"} bg-primary h-[40px] w-[200px] rounded-xl ${type === "rejected" ? "text-primary" : "text-white"} cursor-pointer`}
      >
        المنشورات المرفوضة
      </button>
      <button
        onClick={() => setType("pending")}
        className={`${type === "pending" && "border-primary border bg-white"} bg-primary h-[40px] w-[200px] rounded-xl ${type === "pending" ? "text-primary" : "text-white"} cursor-pointer`}
      >
        المنشورات المعلقة
      </button>
    </section>
  );
};

export default TypeButtons;
