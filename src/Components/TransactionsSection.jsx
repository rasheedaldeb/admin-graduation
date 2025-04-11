import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import SectionHeader from "./SectionHeader";
const TransactionsSection = () => {
  const token = localStorage.getItem("admintoken");
  const navigate = useNavigate();
  // transactions states
  const [transaction, setTransaction] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  // fetch transactions api requesst
  useEffect(() => {
    const fetchTransaction = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/transaction`,
          {
            headers: {
              Authorization: `Bearer ${token} `,
            },
          },
        );
        console.log(res);
        setIsFetching(false);
        setTransaction(res.data.data);
      } catch (e) {
        console.log(e);
        if (e.response.status === 401) {
          alert(e.response.data.message);
          localStorage.removeItem(" admintoken");
          navigate("/admin-signin");
        }
        if (e.message === "Network Error") {
          setError("لا يوجد اتصال بالانترنت");
        }
      }
    };
    fetchTransaction();
  }, []);
  return (
    <section className="flex flex-col gap-10 px-10">
      <SectionHeader title="عمليات التحويل" />
      {error && (
        <div className="flex items-center justify-center text-xl text-red-500">
          {error}
        </div>
      )}
      <div className="transactions max-h-screen overflow-y-scroll" dir="rtl">
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
        ) : transaction.length !== 0 ? (
          transaction.map((item) => (
            <div className="transaction border-primary flex items-center justify-between border-b pb-3">
              <div className="company-name">
                <h4 className="text-primary text-xl font-bold">اسم الشركة</h4>
                <p className="text-secondary text-lg font-bold">
                  {item.Company.Account.name}
                </p>
              </div>
              <div className="user-name">
                <h4 className="text-primary text-xl font-bold">اسم العميل</h4>
                <p className="text-secondary text-lg font-bold">
                  {item.Customer.Account.name}
                </p>
              </div>
              <div className="post-type">
                <h4 className="text-primary text-xl font-bold">
                  نوع العقار المحجوز
                </h4>
                <p className="text-secondary text-lg font-bold">
                  {item.Reservation.Post.type}
                </p>
              </div>
              <div className="Admin-fee">
                <h4 className="text-primary text-xl font-bold">
                  نسبة الادمن من الحجز
                </h4>
                <p className="text-secondary text-lg font-bold">
                  {item.adminFee}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-secondary text-xl">لايوجد عمليات تحويل</p>
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

export default TransactionsSection;
