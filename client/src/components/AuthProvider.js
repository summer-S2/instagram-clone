import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {

  // localStorage에서 user를 불러온다.
  // 새로고침시 인증상태 유지를 위해
  const initialUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(initialUser);

  // user state listener
  useEffect(() => {
    // effect
    if (user) { // 유저가 있으면 
      // localStorage에 user를 저장한다
      // 로그인 후 실행된다
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // localStorage에서 user를 삭제한다
      // 로그아웃 후에 실행된다
      localStorage.removeItem('user');
    }
  }, [user])

  const value = { user, setUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}