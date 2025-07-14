import { createContext, useContext, useState } from "react";

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(Date.now());

  const triggerRefresh = () => {
    setRefreshFlag(Date.now());
  };

  return (
    <RefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);
