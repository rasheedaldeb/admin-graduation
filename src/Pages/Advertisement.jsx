import AddAdvertisement from "../Components/AddAdvertisement";
import AdvertisementSection from "../Components/AdvertisementSection";
import SideBar from "../Components/SideBar";

const Advertisement = () => {
  return (
    <div className="flex justify-between">
      <SideBar />
      <div className="flex w-[70%] flex-col gap-10">
        <AddAdvertisement />
        <AdvertisementSection />
      </div>
    </div>
  );
};

export default Advertisement;
