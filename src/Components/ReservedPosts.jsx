import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import SectionHeader from "../Components/SectionHeader";
import axios from "axios";
const ReservedPosts = () => {
  const token = localStorage.getItem("admintoken");
  const navigate = useNavigate();
  // reserved posts states
  const [reservedPosts, setReservedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // delete reserved post states
  const [success, setSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [confirm, setConfirm] = useState(null);
  // open and close confirm button
  const confirmToggle = (i) => {
    if (confirm == i) {
      return setConfirm(null);
    }
    setConfirm(i);
  };
  // delete reserved post api request
  const deleteReservedPost = async (id) => {
    setIsDeleting(true);
    await axios
      .delete(`${import.meta.env.VITE_API_URL}/api/reservation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setIsDeleting(false);
        setSuccess(res.data.message);
        setTimeout(() => {
          setDeleted(!deleted);
          setSuccess("");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setDeleteError(err.response.data.message);
        setIsDeleting(false);
        if (err.status === 401) {
          alert(err.response.data.message);
          localStorage.removeItem("admintoken");
          navigate("/admin-signin");
        }
        if (err.message === "Network Error") {
          setError("لا يوجد اتصال بالانترنت");
        }
      });
  };
  // reserved posts api request
  useEffect(() => {
    const fetchReservedPosts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reservation`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res.data.data);
        setReservedPosts(res.data.data);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
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
    fetchReservedPosts();
  }, [deleted]);
  return (
    <section className="flex flex-col gap-10 px-10">
      <SectionHeader title="كافة الحجوزات" />
      {success && (
        <div className="flex items-center justify-center text-xl font-bold text-green-600">
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center text-xl font-bold text-red-600">
          {error}
        </div>
      )}
      {deleteError && (
        <div className="flex items-center justify-center text-xl font-bold text-red-600">
          {deleteError}
        </div>
      )}
      <div className="registered max-h-screen overflow-y-scroll" dir="rtl">
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
        ) : reservedPosts.length !== 0 ? (
          reservedPosts.map((item) => (
            <div className="border-primary flex items-center justify-around border-b pb-3">
              <div className="flex flex-col gap-5">
                <div className="content flex items-center gap-8" dir="rtl">
                  <div className="flex flex-col items-start gap-3">
                    <div className="name flex items-start gap-2">
                      <h4 className="text-primary text-xl font-bold">
                        نوع العقار:
                      </h4>
                      <p className="text-secondary text-lg font-bold">
                        {item.Post.type}
                      </p>
                    </div>
                    <div className="deposit flex items-start gap-2">
                      <h4 className="text-primary text-xl font-bold">
                        سعر الرعبون:
                      </h4>
                      <p className="text-secondary text-lg font-bold">
                        {item.Post.deposit}$
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <div className="price-rent flex items-center gap-2">
                      <h4 className="text-primary text-xl font-bold">
                        سعر الأيجار :
                      </h4>
                      <p className="text-secondary text-lg font-bold">
                        {item.Post.salePrice}$
                      </p>
                    </div>
                    <div className="price-sale flex items-start gap-2">
                      <h4 className="text-primary text-xl font-bold">
                        سعر البيع :
                      </h4>
                      <p className="text-secondary text-lg font-bold">
                        {item.Post.rentPrice}$
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3"></div>
                  <div className="flex flex-col items-start gap-5">
                    <h4 className="text-primary text-xl font-bold">
                      قيمة الرعبون
                    </h4>
                    <p className="text-secondary text-lg font-bold">
                      {item.depositAmount}$
                    </p>
                  </div>
                </div>
                <div className="user flex items-center gap-8">
                  <div className="name flex-col items-start gap-5">
                    <h4 className="text-primary text-xl font-bold">
                      اسم العميل
                    </h4>
                    <p className="text-secondary text-lg font-bold">
                      {item.Customer.Account.name}
                    </p>
                  </div>
                  <div className="email flex-col items-start gap-5">
                    <h4 className="text-primary text-xl font-bold">
                      ايميل العميل
                    </h4>
                    <p className="text-secondary text-lg font-bold">
                      {item.Customer.Account.email}
                    </p>
                  </div>
                  <div className="phone flex-col items-start gap-5">
                    <h4 className="text-primary text-xl font-bold">
                      رقم العميل
                    </h4>
                    <p className="text-secondary text-lg font-bold">
                      {item.Customer.Account.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="delete flex items-center gap-7">
                <div className="flex flex-col items-center gap-5">
                  <button
                    onClick={() => confirmToggle(item.id)}
                    className="cursor-pointer rounded-xl bg-red-500 px-6 py-3 text-white"
                  >
                    حذف
                  </button>
                  <div
                    className={`${confirm === item.id ? "flex" : "hidden"} flex-col items-center gap-5`}
                  >
                    <p className="text-secondary text-center text-lg font-bold">
                      هل انت متأكد من الحذف؟
                    </p>
                    <button
                      onClick={() => deleteReservedPost(item.id)}
                      className="bg-primary cursor-pointer rounded-xl px-6 py-3 text-white"
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
            <p className="text-secondary text-xl">لا يوجد منشورات</p>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center justify-center text-xl text-red-600">
          {error}
        </div>
      )}
    </section>
  );
};

export default ReservedPosts;
