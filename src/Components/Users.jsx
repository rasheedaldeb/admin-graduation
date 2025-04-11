import { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
const Users = () => {
  const token = localStorage.getItem("admintoken");
  const navigate = useNavigate();
  // fetch companies states
  const [inputValue, setInputValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/accounts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const filterData = res.data.data.filter((item) => item.role === "user");
        setUserData(filterData);
        console.log(res.data);
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
    fetchUsers();
  }, []);
  return (
    <section className="flex flex-col gap-10 px-10">
      <SectionHeader title="المستخدمين" />
      <input
        type="text"
        placeholder="ابحث"
        onChange={(e) => setInputValue(e.target.value)}
        className="border-primary h-[50px] w-full rounded-3xl border px-3 outline-none"
        dir="rtl"
      />
      <div className="users max-h-screen overflow-y-scroll" dir="rtl">
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
        ) : userData.length !== 0 ? (
          userData
            .filter((item) => item.name.toLowerCase().includes(inputValue))
            .map((item) => (
              <div className="user border-primary flex items-center justify-between border-b pb-3">
                <div className="name flex flex-col items-center gap-3">
                  <h4 className="text-primary text-xl font-bold">
                    اسم المستخدم
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
                    r{item.email}
                  </p>
                </div>
                <div className="phone flex flex-col items-center gap-3">
                  <h4 className="text-primary text-xl font-bold">رقم الهاتف</h4>
                  <p className="text-secondary text-lg font-bold">
                    {item.phone}
                  </p>
                </div>
              </div>
            ))
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-secondary text-xl">لا يوجد مستخدمين</p>
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

export default Users;
