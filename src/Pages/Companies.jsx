import CompaniesSection from "../Components/CompaniesSection";
import CompanyRegisterForm from "../Components/CompanyRegister/CompanyRegisterForm";
import SideBar from "../Components/SideBar";
const Companies = () => {
  return (
    <div className="flex justify-between">
      <SideBar />
      <div className="flex w-[80%] flex-col gap-10">
        <CompanyRegisterForm />
        <CompaniesSection />
      </div>
    </div>
  );
};

export default Companies;
