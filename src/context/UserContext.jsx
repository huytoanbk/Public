import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  const updateUserInfo = (newInfo) => {
    setUserInfo(newInfo);
  };

  const clearUserInfo = () => {
    setUserInfo(null);
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo, clearUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};