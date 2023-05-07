import { useContext } from "react";
import { Navigate } from "react-router-dom"; // 페이지 이동 hooks
import AuthContext from "./AuthContext";

export default function AuthRequired({ children }) { //children : Layout

  const { user } = useContext(AuthContext);

  if (!user) { // 유저가 없으면 로그인 페이지로 이동
    return <Navigate to="/accounts/login" replace={true} /> // replace 현재페이지가 대체됨. 뒤로가기 x
  }

  return children; // 인증에 성공하면 레이아웃 페이지로 이동
}