import { Link, useNavigate } from "react-router-dom";
import SectionHeader from "../SectionHeader";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "./AllPosts.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Navigation } from "swiper/modules";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { StatesContext } from "../../Context/Context";
const Posts = () => {
  const { accepted } = useContext(StatesContext);
  const token = localStorage.getItem("admintoken");
  const navigate = useNavigate();
  // fetch all posts states
  const [allPosts, setAllPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  // fetch posts api request
  useEffect(() => {
    const fetchPosts = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/post`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res);
        setAllPosts(res.data.data);
        setIsFetching(false);
      } catch (e) {
        console.log(e);
        if (e.status === 401) {
          alert(e.response.data.message);
          localStorage.removeItem("admintoken");
          navigate("/admin-signin");
        }
        if (e.message === "Network Error") {
          setError("لايوجد اتصال بالانترنت");
        }
      }
    };
    fetchPosts();
  }, [accepted]);
  return (
    <section className="flex flex-col items-center gap-8 px-10">
      <SectionHeader title=" كافة المنشورات" />
      <input
        type="text"
        placeholder=" ابحث عن الشركة"
        onChange={(e) => setInputValue(e.target.value)}
        className="border-primary min-h-[60px] w-full rounded-3xl border px-3 outline-none"
        dir="rtl"
      />
      {isFetching ? (
        <div className="flex items-center justify-center">
          <Oval
            visible={true}
            height="40"
            width="40"
            color="rgb(23, 43, 78)"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          loop={true}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
          dir="rtl"
        >
          {allPosts.length !== 0 ? (
            allPosts
              .filter(
                (item) =>
                  item.Account &&
                  item.Account.name &&
                  item.Account.name
                    .toLowerCase()
                    .includes(inputValue.toLowerCase()),
              )
              .map((item) => (
                <SwiperSlide>
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="company flex items-center justify-between">
                      <img src="/images/user.png" alt="company" />
                      <Link className="text-secondary text-xl">
                        {item.Account.name}
                      </Link>
                    </div>
                    <div className="h-56 w-full">
                      <img
                        className="mx-auto h-full w-full"
                        src={`${import.meta.env.VITE_API_URL}${item.mainImageUrl}`}
                        alt="post-image"
                      />
                    </div>
                    <div className="flex flex-col gap-7 pt-6">
                      <div
                        href="#"
                        className="text-lg leading-tight font-semibold text-gray-900 hover:underline dark:text-white"
                      >
                        {item.CommercialStoreOrHouse &&
                          item.CommercialStoreOrHouse.description}
                        {item.Villa && item.Villa.description}
                      </div>
                      <div className="mt-4 flex flex-col items-center gap-4">
                        {item.salePrice ? (
                          <h4 className="text-primary text-lg">سعر المبيع</h4>
                        ) : (
                          <h4 className="text-primary text-lg">سعر الايجار</h4>
                        )}
                        <p className="text-2xl leading-tight font-extrabold text-gray-900 dark:text-white">
                          ${item.salePrice ? item.salePrice : item.rentPrice}
                        </p>
                        {item.rejectionReason && (
                          <div className="flex flex-col items-center gap-7">
                            <h4 className="text-xl text-red-500">سبب الرفض</h4>
                            <p className="text-primary text-xl leading-tight">
                              {item.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
          ) : error ? (
            <div className="flex items-center justify-center text-xl font-bold text-red-600">
              {error}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-secondary text-xl">لايوجد شركات</p>
            </div>
          )}
        </Swiper>
      )}
    </section>
  );
};

export default Posts;
