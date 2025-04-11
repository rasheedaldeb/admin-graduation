import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StatesContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
const PostsByState = () => {
  const token = localStorage.getItem("admintoken");
  // const [postId, setPostId] = useState("");
  const [error, setError] = useState("");
  const [succes, setSucces] = useState("");
  const { type, rejected, setRejected, accepted, setAccepted } =
    useContext(StatesContext);
  // fetch posts states
  const navigate = useNavigate();
  const [statePosts, setStatePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // reject states
  const [confirmReject, setConfirmReject] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  // accept post states
  const [isAccepting, setIsAccepting] = useState(false);
  const [confirmAccept, setConfirmAccept] = useState(null);
  // reject poat api request
  const rejectPost = async (e, id) => {
    e.preventDefault();
    setIsRejecting(true);
    await axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/post/${id}/reject`,
        {
          rejectionReason: rejectReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        setSucces(res.data.message);
        setIsRejecting(false);
        setTimeout(() => {
          setRejected(!rejected);
          setSucces("");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data.message);
        setTimeout(() => {
          setError("");
        }, 2000);
        if (err.status === 401) {
          alert(err.response.data.message);
          localStorage.removeItem("admintoken");
          navigate("/admin-signin");
        }
        setIsRejecting(false);
        if (err.message === "Network Error") {
          setError("لا يوجد اتصال بالانترنت");
        }
      });
  };
  // accept post api request
  const acceptPost = async (id) => {
    setIsAccepting(true);
    await axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/post/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        setSucces(res.data.message);
        setIsAccepting(false);
        setTimeout(() => {
          setAccepted(!accepted);
          setSucces("");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data.message);
        setTimeout(() => {
          setError("");
        }, 2000);
        if (err.status === 401) {
          alert(err.response.data.message);
          localStorage.removeItem("admintoken");
          navigate("/admin-signin");
        }
        setIsRejecting(false);
        if (err.message === "Network Error") {
          setError("لا يوجد اتصال بالانترنت");
        }
      });
  };
  // fetch states posts api request
  useEffect(() => {
    const fetchPostsByState = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/post/status/${type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res.data);
        setStatePosts(res.data.data);
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
    fetchPostsByState();
  }, [type, rejected, accepted]);
  // open and close reject confirm section
  const confirmRejectToggle = (i) => {
    if (confirmReject == i) {
      return setConfirmReject(null);
    }
    setConfirmReject(i);
  };
  //open and close accept confirm  section
  const confirmAcceptToggle = (i) => {
    if (confirmAccept == i) {
      return setConfirmAccept(null);
    }
    setConfirmAccept(i);
  };
  return (
    <div className="flex flex-col items-center gap-10 py-5">
      {succes && (
        <div className="flex items-center justify-center text-xl font-bold text-green-600">
          {succes}
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center text-xl font-bold text-red-600">
          {error}
        </div>
      )}
      <div
        className="posts max-h-screen w-full overflow-y-scroll px-5"
        dir="rtl"
      >
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
        ) : statePosts.length !== 0 ? (
          statePosts.map((item) => (
            <div className="post border-primary flex items-center justify-center border-b pb-3">
              <div className="flex w-[70%] items-center gap-10">
                <div className="image">
                  <img
                    src={`https://real-estate-app-i5m8.onrender.com${item.mainImageUrl}`}
                    alt="post-image"
                    className="h-[130px] w-[130px] rounded-xl"
                  />
                </div>
                <div className="flex flex-col items-start gap-5">
                  <div className="content flex items-center gap-8" dir="rtl">
                    <div className="flex flex-col items-start gap-3">
                      <div className="name flex items-center gap-2">
                        <h4 className="text-primary text-xl font-bold">
                          نوع العقار:
                        </h4>
                        <p className="text-secondary text-lg font-bold">
                          {item.type}
                        </p>
                      </div>
                      <div className="company flex items-center gap-2">
                        <h4 className="text-primary text-xl font-bold">
                          الشركة:
                        </h4>
                        <p className="text-secondary text-lg font-bold">
                          {item.Account.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-3">
                      <div className="price-rent flex items-center gap-2">
                        <h4 className="text-primary text-xl font-bold">
                          سعر الأيجار :
                        </h4>
                        <p className="text-secondary text-lg font-bold">
                          {item.rentPrice}$
                        </p>
                      </div>
                      <div className="price-sale flex items-center gap-2">
                        <h4 className="text-primary text-xl font-bold">
                          سعر البيع :
                        </h4>
                        <p className="text-secondary text-lg font-bold">
                          {item.salePrice}$
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-start gap-3">
                      <div className="desc flex items-center gap-2">
                        <h4 className="text-primary text-xl font-bold">
                          الوصف :
                        </h4>
                        <p className="text-secondary text-lg font-bold">
                          {item.House && item.House.description}
                          {item.Villa && item.Villa.description}
                          {item.CommercialStore &&
                            item.CommercialStore.description}
                        </p>
                      </div>
                      <div className="createdAt">
                        <h4 className="text-primary text-xl font-bold">
                          تاريخ الانشاء:
                        </h4>
                        <p className="text-secondary text-lg font-bold">
                          {item.House && item.House.createdAt}
                          {item.Villa && item.Villa.createdAt}
                          {item.CommercialStore &&
                            item.CommercialStore.createdAt}
                        </p>
                      </div>
                    </div>
                    {item.Villa && (
                      <div className="flex-col items-start gap-3">
                        <div className="landArea flex items-center gap-2">
                          <h4 className="text-primary text-xl font-bold">
                            مساحة الارض :
                          </h4>
                          <p className="text-secondary text-lg font-bold">
                            {item.Villa.landArea}
                          </p>
                        </div>
                        <div className="building flex items-center gap-2">
                          <h4 className="text-primary text-xl font-bold">
                            مساحة الفيلا :
                          </h4>
                          <p className="text-secondary text-lg font-bold">
                            {item.Villa.buildingArea}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {type === "pending" && (
                <div className="buttons flex w-[25%] flex-col items-center gap-2">
                  <div className="flex items-center gap-5">
                    <button
                      className={`${confirmReject === item.id ? "hidden" : "block"} cursor-pointer rounded-xl bg-red-500 px-6 py-3 text-white`}
                      onClick={() => {
                        confirmRejectToggle(item.id);
                      }}
                    >
                      رفض
                    </button>
                    <div className="flex flex-col items-center gap-5">
                      <button
                        onClick={() => {
                          confirmAcceptToggle(item.id);
                        }}
                        className={`${confirmAccept === item.id ? "hidden" : "block"} cursor-pointer rounded-xl bg-green-500 px-6 py-3 text-white`}
                      >
                        قبول
                      </button>
                      <button
                        onClick={() => acceptPost(item.id)}
                        className={`${confirmAccept === item.id ? "block" : "hidden"} bg-primary cursor-pointer rounded-xl px-6 py-3 text-white`}
                      >
                        {isAccepting ? (
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
                  <form
                    onSubmit={(e) => rejectPost(e, item.id)}
                    className={`reason ${confirmReject === item.id ? "flex" : "hidden"} w-full flex-col gap-2`}
                  >
                    <label className="text-secondary text-xl">سبب الرفض</label>
                    <input
                      type="text"
                      className="border-primary w-full rounded-3xl border px-3 py-2 outline-none"
                      placeholder="اكتب السبب"
                      required
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex items-center justify-center">
                      <button className="bg-primary mx-auto block cursor-pointer rounded-3xl border-white px-6 py-3 tracking-wider text-white">
                        {isRejecting ? (
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
                  </form>
                </div>
              )}
              {type === "rejected" && (
                <div className="flex flex-col items-center gap-7">
                  <h4 className="text-xl font-bold text-red-500">سبب الرفض</h4>
                  <p className="text-secondary text-lg font-bold">
                    {item.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : error ? (
          <div className="flex items-center justify-center text-xl font-bold text-red-600">
            {error}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-secondary text-xl">لا يوجد منشورات</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsByState;
