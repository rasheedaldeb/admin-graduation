import { Routes, Route } from "react-router-dom";
import { StatesProvider } from "./Context/Context";
import Home from "./Pages/Home";
import AdminSignin from "./Pages/AdminSignin";
import Advertisement from "./Pages/Advertisement";
import Companies from "./Pages/Companies";
import Complaint from "./Pages/Complaint";
import RegistrationUsers from "./Pages/RegistrationUsers";
import ProtectedRoute from "./Components/ProtectedRoute";
import StatesPosts from "./Pages/StatesPosts";
import Reservation from "./Pages/Reservation";
import Transaction from "./Pages/Transactions";
function App() {
  return (
    <>
      <StatesProvider>
        <Routes>
          <Route path="/admin-signin" element={<AdminSignin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/states-posts" element={<StatesPosts />} />
            <Route path="/advertisement" element={<Advertisement />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/complaints" element={<Complaint />} />
            <Route path="/users" element={<RegistrationUsers />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/transactions" element={<Transaction />} />
          </Route>
        </Routes>
      </StatesProvider>
    </>
  );
}

export default App;
