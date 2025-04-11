import axios from "axios";
import { useState } from "react";
import { Oval } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";

const SignInForm = () => {
  const [showPass, setShowPass] = useState(false);
  // signin states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignningIn, setIsSignningIn] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const navigate = useNavigate();
  // form object to send to the api
  const userSigninData = new FormData();
  userSigninData.append("email", email);
  userSigninData.append("password", password);
  // signin api logic
  const adminSignin = async (e) => {
    e.preventDefault();
    setIsSignningIn(true);
    await axios
      .post(`${import.meta.env.VITE_API_URL}/api/auth/login`, userSigninData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          setSuccess(res.data.message);
          setError("");
          setIsSignningIn(false);
          localStorage.setItem("admintoken", res.data.token);
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        setError(err.response.data.message);
        console.log(err);
        setIsSignningIn(false);
      });
  };
  return (
    <section
      className="mt-10 flex w-full flex-col items-center gap-8"
      dir="rtl"
    >
      <h2 className="text-secondary text-3xl font-bold">
        تسجيل الدخول الى الحساب
      </h2>
      <form className="w-1/2" onSubmit={(e) => adminSignin(e)}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-secondary mb-2 block text-lg font-bold">
              البريد الالكتروني
            </label>
            <input
              name="email"
              type="text"
              className="border-primary w-full rounded-3xl border bg-gray-100 px-4 py-3 text-lg text-gray-800 transition-all outline-none"
              placeholder="ادخل بريدك الالكتروني"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-secondary mb-2 block text-lg font-bold">
              كلمة المرور
            </label>
            <div className="border-primary flex h-[55px] w-full items-center justify-between rounded-3xl border bg-gray-100 px-4 text-lg text-gray-800 transition-all outline-none focus:bg-gray-100">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                className="h-full w-[80%] outline-none"
                placeholder="ضع كلمة مرور "
                required
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={
                  showPass ? "/public/images/eye.png" : "/images/closed-eye.png"
                }
                alt="eye"
                onClick={() => setShowPass(!showPass)}
                className="cursor-pointer"
              />
            </div>
          </div>
          {error && (
            <div className="flex items-center justify-center text-xl text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center justify-center text-xl text-green-600">
              {success}
            </div>
          )}
          <div class="mt-5 flex items-center justify-center">
            <button
              type="submit"
              class="bg-primary hover:bg-secondary block cursor-pointer rounded-3xl px-6 py-3 text-lg tracking-wider text-white"
            >
              {isSignningIn ? (
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
                "تسجيل الدخول"
              )}
            </button>
          </div>
          {/* facebook & google buttons */}
          <div className="flex items-center justify-center gap-3">
            <button>
              <img src="/images/facebook.png" alt="facebook" />
            </button>
            <button>
              <img src="/images/google.png" alt="google" />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default SignInForm;
