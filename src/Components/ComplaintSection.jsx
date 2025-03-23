import { useState } from "react";
import SectionHeader from "./SectionHeader";
import { useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
const ComplaintSection = () => {
  const token = localStorage.getItem("admintoken");
  // complaints states
  const [allComplaints, setAllComplaints] = useState([]);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  // delete states
  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  // fetch complaints api request
  useEffect(() => {
    const fetchAllComplaints = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/complaint/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res);
        setAllComplaints(res.data.data);
        setIsFetching(false);
      } catch (e) {
        console.log(e);
        if (e.status === 401) {
          alert(e.response.data.message);
          localStorage.removeItem("admintoken");
        }
        if (e.message === "Network Error") {
          setError("لا يوجد اتصال بالانترنت");
          setIsFetching(false);
        }
      }
    };
    fetchAllComplaints();
  }, []);
  // open confirm delete
  const confirmToggle = (i) => {
    if (confirm == i) {
      return setConfirm(null);
    }
    setConfirm(i);
  };
  return (
    <section className="flex flex-col gap-10 px-10">
      <SectionHeader title="الشكاوي" />
      <input
        type="text"
        placeholder="ابحث"
        className="border-primary h-[50px] w-full rounded-3xl border px-3 outline-none"
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
      ) : allComplaints.length !== 0 ? (
        allComplaints.map((item) => (
          <div className="complaints max-h-screen overflow-y-scroll" dir="rtl">
            <div className="complaint border-primary flex items-center justify-between border-b pb-3">
              <div className="name flex flex-col items-center gap-3">
                <h4 className="text-primary text-xl font-bold">اسم المستخدم</h4>
                <p className="text-secondary text-lg font-bold">رشيد</p>
              </div>
              <div className="company flex flex-col items-center gap-3">
                <h4 className="text-primary text-xl font-bold">اسم الشركة</h4>
                <p className="text-secondary text-lg font-bold">رشيد</p>
              </div>
              <div className="complaint-content flex w-[50%] flex-col items-center gap-3">
                <h4 className="text-primary text-xl font-bold">الشكوى</h4>
                <p className="text-secondary text-lg font-bold">
                  test test test
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button className="cursor-pointer rounded-xl bg-red-500 px-6 py-3 text-white">
                  حذف
                </button>
                <p className={`text-secondary text-xl`}>
                  هل انت متأكد من الحذف
                </p>
                <button
                  className={`bg-primary flex h-[40px] w-[100px] cursor-pointer items-center justify-center rounded-xl text-white`}
                >
                  تأكيد
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-secondary text-xl">لا يوجد شكاوي</p>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center text-xl text-red-600">
          {error}
        </div>
      )}
    </section>
  );
};

export default ComplaintSection;
