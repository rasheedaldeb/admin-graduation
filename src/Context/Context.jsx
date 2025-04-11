import { useState, createContext } from "react";

const StatesContext = createContext();

const StatesProvider = ({ children }) => {
  const [type, setType] = useState("pending");
  const [createdCompany, setCreatedCompany] = useState();
  const [createdAd, setCreatedAd] = useState();
  const [isDeleted, setIsDeleted] = useState();
  const [rejected, setRejected] = useState();
  const [accepted, setAccepted] = useState();
  return (
    <StatesContext.Provider
      value={{
        createdCompany,
        setCreatedCompany,
        createdAd,
        setCreatedAd,
        isDeleted,
        setIsDeleted,
        type,
        setType,
        rejected,
        setRejected,
        accepted,
        setAccepted,
      }}
    >
      {children}
    </StatesContext.Provider>
  );
};
export { StatesContext, StatesProvider };
