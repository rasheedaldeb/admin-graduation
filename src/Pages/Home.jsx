import Posts from "../Components/AllPosts/Posts";
import SideBar from "../Components/SideBar";

const Home = () => {
  return (
    <div className="flex justify-between">
      <SideBar />
      <div className="flex w-[75%] flex-col gap-10 py-10">
        <Posts />
      </div>
    </div>
  );
};

export default Home;
