import AdminSignInForm from "../Components/AdminSignInForm";
const AdminSignin = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <img
        src="/images/register-signin.jpg"
        alt=""
        className="h-full w-[45%]"
        loading="lazy"
      />
      <AdminSignInForm />
    </div>
  );
};

export default AdminSignin;
