import SideBar from "../Components/SideBar";
import Users from "../Components/Users";
const RegistrationUsers = () => {
  return (
    <div className="flex justify-between py-10">
      <SideBar />
      <div className="flex w-[70%] flex-col gap-10">
        <Users />
      </div>
    </div>
  );
};

export default RegistrationUsers;
