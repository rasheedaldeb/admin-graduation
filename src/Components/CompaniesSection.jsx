import { useContext, useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { StatesContext } from "../Context/Context";
const CompaniesSection = () => {
  const token = localStorage.getItem("admintoken");
  const { createdCompany } = useContext(StatesContext);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  // delete states
  const [confirm, setConfirm] = useState(null);
  const { isDeleted, setIsDeleted } = useContext(StatesContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  // fetch companies states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [companiesData, setCompaniesData] = useState([]);
  // active and disactive vars
  const [active, setActive] = useState();
  const [isActive, setIsActive] = useState(false);
  const [activaiting, setActivaiting] = useState(false);
  const [success, setSuccess] = useState("");
  const [activeError, setActiveError] = useState("");
  const [confirm2, setConfirm2] = useState(null);
  // active account form data
  // open and close confirm2 section
  const confirmToggle2 = (i) => {
    if (confirm2 == i) {
      return setConfirm2(null);
    }
    setConfirm2(i);
  };
  const activeData = new FormData();
  activeData.append("isActive", active); // active and disActive api request
  const activeAccount = async (id) => {
    setActivaiting(true);
    await axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/auth/editAccount/${id}`,
        activeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        setActivaiting(false);
        setSuccess(res.data.message);
        setTimeout(() => {
          setSuccess("");
          setConfirm2(false);
          setIsActive(!isActive);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setActivaiting(false);
        setActiveError(err.response.data.message);
        setTimeout(() => {
          setActiveError("");
        }, 2000);
        if (err.status === 401) {
          alert(err.response.data.message);
          localStorage.removeItem("admintoken");
          navigate("/admin-signin");
        }
      });
  };
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/accounts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const filterData = res.data.data.filter(
          (item) => item.role === "company",
        );
        setCompaniesData(filterData);
        console.log(res.data);
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
        }
      }
    };
    fetchCompanies();
  }, [createdCompany, isDeleted, isActive]);
  // delete logic
  // open and close confirm section
  const confirmToggle = (i) => {
    if (confirm == i) {
      return setConfirm(null);
    }
    setConfirm(i);
  };
  // delete api request
  const deleteCompany = async (id) => {
    setIsDeleting(true);
    await axios
      .delete(`${import.meta.env.VITE_API_URL}/api/auth/account/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setIsDeleting(false);
        setDeleteSuccess(res.data.message);
        setTimeout(() => {
          setDeleteSuccess("");
          setIsDeleted(!isDeleted);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
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
    <section className="flex flex-col gap-10 px-6">
      <SectionHeader title="كافة الشركات" />
      <input
        type="text"
        placeholder="ابحث"
        onChange={(e) => setInputValue(e.target.value)}
        className="border-primary h-[50px] w-full rounded-3xl border px-3 outline-none"
        dir="rtl"
      />
      {deleteSuccess && (
        <div className="flex items-center justify-center text-xl text-green-500">
          {deleteSuccess}
        </div>
      )}
      {deleteError && (
        <div className="flex items-center justify-center text-xl text-red-500">
          {deleteError}
        </div>
      )}
      {success && (
        <div className="flex items-center justify-center text-xl text-green-500">
          {success}
        </div>
      )}
      {activeError && (
        <div className="flex items-center justify-center text-xl text-red-500">
          {activeError}
        </div>
      )}
      <div className="companies max-h-screen overflow-y-scroll" dir="rtl">
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
        ) : companiesData.length !== 0 ? (
          companiesData
            .filter((item) =>
              item.name.toLowerCase().includes(inputValue.toLowerCase()),
            )
            .map((item) => (
              <div className="company border-primary flex items-center justify-between border-b pb-3">
                <div className="grid grid-cols-5 items-center gap-3">
                  <div className="name flex flex-col items-center gap-3">
                    <h4 className="text-primary text-xl font-bold">
                      اسم الشركة
                    </h4>
                    <p className="text-secondary text-lg font-bold">
                      {item.name}
                    </p>
                  </div>
                  <div className="email flex flex-col items-center gap-3">
                    <h4 className="text-primary text-xl font-bold">
                      البريد الالكتروني
                    </h4>
                    <p className="text-secondary text-lg font-bold">
                      {item.email}
                    </p>
                  </div>
                  <div className="phone flex flex-col items-center gap-3">
                    <h4 className="text-primary text-xl font-bold">
                      رقم التواصل
                    </h4>
                    <p className="text-secondary text-lg font-bold">
                      {item.phone}
                    </p>
                  </div>
                  <div className="auth-code flex flex-col items-center gap-3">
                    <h4 className="text-primary text-xl font-bold">
                      رقم السجل التجاري
                    </h4>
                    <p className="text-secondary text-lg font-bold">
                      {item.authCode}
                    </p>
                  </div>
                  <div className="buttons flex items-center justify-center gap-5">
                    <div className="active-disactive flex flex-col items-center gap-2">
                      {item.isActive === false && (
                        <button
                          onClick={() => {
                            setActive(true);
                            confirmToggle2(item.id);
                          }}
                          className="h-[40px] w-[100px] cursor-pointer rounded-xl bg-green-500 text-white"
                        >
                          تفعيل
                        </button>
                      )}
                      {item.isActive === true && (
                        <button
                          onClick={() => {
                            setActive(false);
                            confirmToggle2(item.id);
                          }}
                          className="h-[40px] w-[100px] cursor-pointer rounded-xl bg-amber-400 text-black"
                        >
                          الغاء التفعيل
                        </button>
                      )}
                      <button
                        onClick={() => activeAccount(item.id)}
                        className={`${confirm2 === item.id ? "" : "hidden"} bg-primary flex h-[40px] w-[100px] cursor-pointer items-center justify-center rounded-xl text-white`}
                      >
                        {activaiting ? (
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
                    <div className="delete flex flex-col items-center gap-2">
                      <button
                        onClick={() => {
                          confirmToggle(item.id);
                        }}
                        className="h-[40px] w-[100px] cursor-pointer rounded-xl bg-red-600 text-white"
                      >
                        حذف
                      </button>
                      <p
                        className={`${confirm === item.id ? "block" : "hidden"} text-secondary text-xl`}
                      >
                        هل انت متأكد من الحذف
                      </p>
                      <button
                        onClick={() => {
                          deleteCompany(item.id);
                        }}
                        className={`${confirm === item.id ? "" : "hidden"} bg-primary flex h-[40px] w-[100px] cursor-pointer items-center justify-center rounded-xl text-white`}
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
              </div>
            ))
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-secondary text-xl">لايوجد شركات</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center text-xl text-red-600">
            {error}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompaniesSection;
