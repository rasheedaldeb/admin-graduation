import { useState } from "react";
import SectionHeader from "./SectionHeader";
import { useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
const ComplaintSection = () => {
  const [inputValue, setInputValue] = useState("");
  const token = localStorage.getItem("admintoken");
  const navigate = useNavigate();
  // complaints states
  const [allComplaints, setAllComplaints] = useState([]);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  // delete states
  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [success, setSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
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
          navigate("/admin-signin");
        }
        if (e.message === "Network Error") {
          setError("لا يوجد اتصال بالانترنت");
          setIsFetching(false);
        }
      }
    };
    fetchAllComplaints();
  }, [isDeleted]);
  // open confirm delete
  const confirmToggle = (i) => {
    if (confirm == i) {
      return setConfirm(null);
    }
    setConfirm(i);
  };
  // delete compaint api request
  const deleteComplaint = async (id) => {
    setIsDeleting(true);
    await axios
      .delete(`${import.meta.env.VITE_API_URL}/api/complaint/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setIsDeleting(false);
        setSuccess(res.data.message);
        setTimeout(() => {
          setSuccess("");
          setIsDeleted(!isDeleted);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setIsDeleting(false);
        setDeleteError(err.response.data.message);
        setTimeout(() => {
          setDeleteError("");
        }, 2000);
        if (err.status === 401) {
          alert(err.response.data.message);
          localStorage.removeItem("admintoken");
          navigate("/admin-signin");
        }
      });
  };
  return (
    <section className="flex flex-col gap-10 px-10">
      <SectionHeader title="الشكاوي" />
      <input
        type="text"
        placeholder="ابحث"
        className="border-primary h-[50px] w-full rounded-3xl border px-3 outline-none"
        dir="rtl"
        onChange={(e) => setInputValue(e.target.value)}
      />
      {success && (
        <div className="flex items-center justify-center text-xl text-green-500">
          {success}
        </div>
      )}
      {deleteError && (
        <div className="flex items-center justify-center text-xl text-red-500">
          {deleteError}
        </div>
      )}
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
        allComplaints
          .filter((item) =>
            item.Customer.Account.name
              .toLowerCase()
              .includes(inputValue.toLowerCase()),
          )
          .map((item) => (
            <>
              <div
                className="complaints max-h-screen overflow-y-scroll"
                dir="rtl"
              >
                <div className="complaint border-primary flex items-center justify-between border-b pb-3">
                  <div className="name flex flex-col items-center gap-3">
                    <h4 className="text-primary text-xl font-bold">
                      اسم المستخدم
                    </h4>
                    <p className="text-secondary text-lg font-bold">
                      {item.Customer.Account.name}
                    </p>
                  </div>
                  <div className="company flex flex-col items-center gap-3">
                    <h4 className="text-primary text-xl font-bold">
                      اسم الشركة
                    </h4>
                    <p className="text-secondary text-lg font-bold">
                      {item.Company.Account.name}
                    </p>
                  </div>
                  <div className="complaint-content flex w-[50%] flex-col items-center gap-3">
                    <h4 className="text-primary text-xl font-bold">الشكوى</h4>
                    <p className="text-secondary text-lg font-bold">
                      {item.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => confirmToggle(item.id)}
                      className="cursor-pointer rounded-xl bg-red-500 px-6 py-3 text-white"
                    >
                      حذف
                    </button>
                    <p
                      className={`${confirm === item.id ? "block" : "hidden"} text-secondary text-xl`}
                    >
                      هل انت متأكد من الحذف
                    </p>
                    <button
                      onClick={() => deleteComplaint(item.id)}
                      className={`${confirm === item.id ? "block" : "hidden"} bg-primary flex h-[40px] w-[100px] cursor-pointer items-center justify-center rounded-xl text-white`}
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
            </>
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
