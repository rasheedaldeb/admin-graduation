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
  }, [createdCompany, isDeleted]);
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
    <section className="flex flex-col gap-10 px-10">
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
            .filter((item) => item.name.toLowerCase().includes(inputValue))
            .map((item) => (
              <div className="company border-primary flex items-center justify-between border-b pb-3">
                <div className="name flex flex-col items-center gap-3">
                  <h4 className="text-primary text-xl font-bold">اسم الشركة</h4>
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
