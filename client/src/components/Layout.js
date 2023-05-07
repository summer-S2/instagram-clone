import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import AuthContext from "./AuthContext";

export default function Layout() {

  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-sm mx-auto pt-10">

      {/* NavBar */}
      <nav className="fixed top-0 left-0 w-full border-b z-10 bg-white">
        <div className="max-w-sm mx-auto px-2 h-10 flex justify-between items-center">
          <Link to="/">
            <img className="w-24" src="/images/logo.png" />{/* /하면 public에서 찾음 */}
          </Link>
          <ul className="flex items-center">
            {/* home버튼 - 피드로 이동 */}
            <li>
              <Link to="/" className="block">
                <svg
                  className="w-6"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                  </path>
                </svg>
              </Link>
            </li>
            {/* 검색 버튼 */}
            <li className="ml-2">
              <Link to="/search" className="block">
                <svg
                  className="w-6"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
                    fill="none"
                    stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
                </svg>
              </Link>
            </li>
            {/* 유저 프로필로 이동 */}
            <li className="ml-2">
              <Link to={`/profiles/${user.username}`}>
                <img
                  src={`${process.env.REACT_APP_SERVER}/files/profiles/${user.image}`}
                  className="w-8 h-8 object-cover rounded-full"
                />
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* 컨텐츠 */}
      {/* Route컴포넌트의 children 컴포넌트들이 아웃렛에서 렌더링됨 */}
      <Outlet />
    </div>
  )
}