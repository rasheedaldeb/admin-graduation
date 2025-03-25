import SideBar from "../Components/SideBar";
import TransactionsSection from "../Components/TransactionsSection";
const Transactions = () => {
  return (
    <div className="flex justify-between">
      <SideBar />
      <div className="flex w-[75%] flex-col gap-10 py-10">
        <TransactionsSection />
      </div>
    </div>
  );
};

export default Transactions;
