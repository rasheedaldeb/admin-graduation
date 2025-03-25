import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { useEffect, useState } from "react";
import axios from "axios";
const SideBar = () => {
  const token = localStorage.getItem("admintoken");
  // logout states
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  // admin wallet states
  const [walletMoney, setWalletMoney] = useState();
  const [isLoading, setIsLoading] = useState(false);
  // admin wallet api request
  useEffect(() => {
    const fetchAdminWallet = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/wallet/admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res);
        setWalletMoney(res.data.data.walletBalance);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        if (e.status === 401) {
          alert(e.response.data.message);
          localStorage.removeItem("admintoken");
          setIsLoading(false);
          navigate("/admin-signin");
        }
      }
    };
    fetchAdminWallet();
  }, []);
  // logout api request
  const logout = async () => {
    setIsLoggingOut(true);
    await axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setIsLoggingOut(false);
        console.log(res);
        localStorage.removeItem("admintoken");
        alert(res.data.message);
        navigate("/admin-signin");
      })
      .catch((err) => {
        if (err.status === 401) {
          localStorage.removeItem("admintoken");
          navigate("/admin-signin");
        }
      });
  };
  return (
    <aside className="border-primary fixed top-0 right-0 flex h-screen w-[20%] flex-col items-center gap-3 overflow-y-scroll border-l">
      <div className="logo">
        <img
          src="/images/logo.png"
          alt="logo"
          className="h-[120px] w-[120px]"
        />
      </div>
      <div className="wallet flex items-center gap-5" dir="rtl">
        <h3 className="text-secondary text-xl font-bold">المحفظة</h3>
        <div className="border-primary text-secondary rounded-sm border px-8 py-3 text-xl font-bold">
          {isLoading ? (
            <Oval
              visible={true}
              height="20"
              width="20"
              color="rgb(23, 43, 78)"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            `${walletMoney}$`
          )}
        </div>
      </div>
      <div className="links">
        <ul className="flex flex-col items-center gap-8">
          <li>
            <Link to="/" className="text-secondary text-xl font-bold">
              الرئيسية
            </Link>
          </li>
          <li>
            <Link
              to="/transactions"
              className="text-secondary text-xl font-bold"
            >
              عمليات الدفع
            </Link>
          </li>
          <li className="text-center">
            <Link
              to="/states-posts"
              className="text-secondary w-full text-center text-xl font-bold"
            >
              المنشورات المعلقة و المرفوضة
            </Link>
          </li>
          <li>
            <Link
              to="/reservation"
              className="text-secondary text-xl font-bold"
            >
              الحجوزات
            </Link>
          </li>
          <li>
            <Link
              to="/advertisement"
              className="text-secondary text-xl font-bold"
            >
              الاعلانات
            </Link>
          </li>
          <li>
            <Link to="/companies" className="text-secondary text-xl font-bold">
              الشركات
            </Link>
          </li>
          <li>
            <Link to="/complaints" className="text-secondary text-xl font-bold">
              الشكاوي
            </Link>
          </li>
          <li>
            <Link to="/users" className="text-secondary text-xl font-bold">
              المستخدمين
            </Link>
          </li>
        </ul>
      </div>
      <div className="logout">
        <button
          onClick={logout}
          className="bg-primary cursor-pointer rounded-xl p-3 text-white"
        >
          {isLoggingOut ? (
            <Oval
              visible={true}
              height="40"
              width="40"
              color="#fff"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            "تسجيل الخروج"
          )}
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
