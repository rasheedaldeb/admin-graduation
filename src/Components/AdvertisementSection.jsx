import { useContext, useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import { StatesContext } from "../Context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import ModalImage from "react-modal-image";
const AdvertisementSection = () => {
  const token = localStorage.getItem("admintoken");
  const { createdAd } = useContext(StatesContext);
  const navigate = useNavigate();
  // delete ad states
  const { isDeleted, setIsDeleted } = useContext(StatesContext);
  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [adId, setAdId] = useState();
  // fetch ads states
  const [advertisement, setAdvertisement] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  // fetch ads api
  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/external_ad`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res);
        setAdvertisement(res.data.data);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        if (e.status === 401) {
          alert(e.response.data.message);
          localStorage.removeItem("admintoken");
          navigate("/admin-signin");
        }
        if (e.message === "Network Error") {
          setError("لايوجد اتصال بالانترنت");
          setIsLoading(false);
        }
      }
    };
    fetchAds();
  }, [createdAd, isDeleted]);
  // open and close confirm section
  const confirmToggle = (i) => {
    if (confirm == i) {
      return setConfirm(null);
    }
    setConfirm(i);
  };
  // delete ad api request
  const deleteAd = async () => {
    setIsDeleting(true);
    await axios
      .delete(`${import.meta.env.VITE_API_URL}/api/external_ad/${adId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setIsDeleting(false);
        setTimeout(() => {
          setIsDeleted(!isDeleted);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  return (
    <section className="flex flex-col gap-10 px-10">
      <SectionHeader title="كافة الاعلانات" />
      <input
        type="text"
        placeholder="ابحث"
        onChange={(e) => setInputValue(e.target.value)}
        className="border-primary h-[50px] w-full rounded-3xl border px-3 outline-none"
        dir="rtl"
      />
      {isLoading ? (
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
        <div className="addvs grid grid-cols-4 gap-5">
          {advertisement.length !== 0 ? (
            advertisement
              .filter((item) =>
                item.content.toLowerCase().includes(inputValue.toLowerCase()),
              )
              .map((item) => (
                <div className="addv flex flex-col items-center gap-2">
                  <ModalImage
                    small={`${import.meta.env.VITE_API_URL}${item.imageUrl}`}
                    large={`${import.meta.env.VITE_API_URL}${item.imageUrl}`}
                    loading="lazy"
                    alt="add"
                    className="h-[250px]"
                  />
                  <p className="text-secondary text-xl">{item.content}</p>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        setAdId(item.id);
                        confirmToggle(item.id);
                      }}
                      className="h-[40px] w-[100px] cursor-pointer rounded-xl bg-red-600 text-white"
                    >
                      حذف
                    </button>
                    <div
                      className={`${confirm === item.id ? "flex" : "hidden"} flex-col items-center gap-2`}
                    >
                      <p text-xl text-secondary>
                        هل انت متأكد من الحذف؟
                      </p>
                      <button
                        onClick={() => {
                          deleteAd();
                        }}
                        className="bg-primary flex h-[40px] w-[100px] cursor-pointer items-center justify-center rounded-xl text-white"
                      >
                        {isDeleting ? (
                          <Oval
                            visible={true}
                            height="30"
                            width="30"
                            color="#fff"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        ) : (
                          "تأكيد"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-secondary text-xl">لايوجد اعلانات</p>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center text-xl text-red-600">
              {error}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AdvertisementSection;
