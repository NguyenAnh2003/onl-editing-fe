/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    /**
     * @param currentUser
     * setCookie for currentUser
     * exp time 24d
     */
    const storedUser = Cookies.get('currentUser');
    return storedUser ? JSON.parse(storedUser) : {};
  });

  const login = useCallback((response) => {
    setCurrentUser(response);
    /** setCookie currentUser */
    const { userId, username } = response;
    Cookies.set('currentUser', JSON.stringify({ userId, username }), { expires: 24 });
  }, []);

  // useEffect(() => {
  //   const storedUser = Cookies.get('currentUser');
  //   if(storedUser) setCurrentUser(JSON.parse(storedUser))
  // }, [])

  const contextValue = useMemo(
    () => ({
      currentUser,
      login,
    }),
    [currentUser, login]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export { UserProvider, UserContext };
