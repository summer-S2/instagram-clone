import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import ArticleCreate from "./ArticleCreate";
import Timeline from "./Timeline";
import { getProfile, getTimeline, follow, unfollow } from "../utils/requests";


export default function Profile() {

  const { username } = useParams(); // 파라미터(주소창)에서 얻은 값
  const { user, setUser } = useContext(AuthContext); // AuthProvider에있는 유저 (로그인유저 )
  // 프로필 유저와 로그인 유저의 일치 여부
  const isMaster = user.username === username;
  const [ profile, setProfile ] = useState(null);
  const [ articles, setArticles ] = useState(null);
  const [ articleCount, setArticleCount ] = useState(0);
  // 모달 활성화(새 게시물)
  const [ active, setActive ] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setProfile(null);

    Promise.all([ // 파라미터가 array ,하나라도 err가 생기면 모두 err
      getProfile(username), 
      getTimeline(username), // 요청의 결과를 promise로 반환
    ])
      .then(([profileData, timelineData])=> {
        setProfile(profileData.profile);
        setArticles(timelineData.articles);
        setArticleCount(timelineData.articleCount);
      })
      .catch(error => {
        console.log(error);
        navigate('/notfound', { replace: true })
      })

  }, [username])

  // console.log(profile); // {username: 'textname', fullName: '회원가입 테스트', image: 'default.png', isFollowing: false, followerCount: 0, …}
  // console.log(articles);

  // 로그아웃
  function handleSignOut() {
    const confirmed = window.confirm('Are you sure to log out?'); /* 확인,취소를 bool로 반환 */

    if (confirmed) {
      setUser(null);
    }
  }

  // 팔로우
  async function handleFollow() {
    try {
      await follow(username);
      
      setProfile({ ...profile, isFollowing: true });

    } catch (error) {
      alert(error);
    }
  }

  // 언팔로우
  async function handleUnFollow() {
    try {
      await unfollow(username);

      setProfile({ ...profile, isFollowing: false });
    } catch (error) {
      alert(error);
    }
  }

  // 타이틀 업데이트
  useEffect(() => {
    document.title = `${username} - Instagram`;
  }, [])

  if (!profile) {
    return <p>fetching profile...</p>
  }

  return (
    <>
      {/* 프로필 부분 */}
      <div className="px-4 mt-8">
        <div className="flex">
          <img 
            src={`${process.env.REACT_APP_SERVER}/files/profiles/${profile.image}`}
            className="w-20 h-20 object-cover border rounded-full"
          />
          <div className="grow ml-4">
            <div className="flex items-center mb-4">
              <h3>{profile.username}</h3>

              {/* 프로필유저 === 로그인유저 */}
              {isMaster && (
                <>
                  {/* 정보수정버튼 */}
                  <Link to="/accounts/edit" className="ml-2 bg-gray-200 rounded-lg px-4 py-2 text-sm font-semibold">
                    Edit profile
                  </Link>
                  {/* 로그아웃 버튼 */}
                  <button
                    className="ml-2 bg-gray-200 px-4 py-2 text-sm font-semibold rounded-lg"
                    onClick={handleSignOut}
                  >
                    Out
                  </button> 
                </>
              )}

              {/* 프로필유저 !== 로그인유저 */}
              {/* 팔로우 버튼 */}
              {(!isMaster && profile.isFollowing) && ( // 프로필유저가 로그인유저아니고 + 팔로우 하고 있음
                <button 
                  className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
                  onClick={handleUnFollow}
                >
                  Following
                </button>
              )}
              {(!isMaster && !profile.isFollowing) && ( // 프로필유저가 로그인유저아니고 + 팔로우 하지 않음
                <button
                  className="ml-2 bg-blue-500 text-white px-4 py-2 font-semibold p-2 rounded-lg"
                  onClick={handleFollow}
                >
                  Follow
                </button>
              )}
            </div>

            {/* 게시물 수, 팔로워 수, 팔로잉 수 */}
            <ul className="flex items-center mb-4">
              <li className="w-1/3">
                <div className="text-sm">
                  <span className="font-semibold">
                    {profile.articleCount}
                  </span>
                  {" "}
                  photos
                </div>
              </li>
              <li className="w-1/3">
                <Link to={`/profiles/${username}/followers`} className="block text-sm">
                  <span className="font-semibold">
                    {profile.followerCount}
                  </span>
                  {" "}
                  followers
                </Link>                               
              </li>
              <li className="w-1/3">
                <Link to={`/profiles/${username}/following`} className="block text-sm">
                  <span className="font-semibold">
                    {profile.followingCount}
                  </span>
                  {" "}
                  followings
                </Link>              
              </li>
            </ul>

            {/* 유저이름과 자기소개 */}
            <div>
              {profile.fullName && ( // 유저이름은 있으면 표시
                <h3 className="text-sm font-semibold my-2">{profile.fullName}</h3>
              )}
              <p className="text-sm my-2">
                {profile.bio}
              </p>
            </div>

            {/* 모달 열기 버튼 (게시물 작성) */}
            <button
              className="fixed right-8 bottom-8 hover:scale-110 transition-all"
              onClick={() => setActive(true)}
            >
              <svg
                className="w-6"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512"
              >
                <path d="M200 344V280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H200V168C200 154.7 210.7 144 224 144C237.3 144 248 154.7 248 168V232H312C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H248V344C248 357.3 237.3 368 224 368C210.7 368 200 357.3 200 344zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <hr className="mt-4 mb-8" />

      {/* 타임라인 부분 */}
      <Timeline articles={articles} articleCount={articleCount} />

      {/* 게시물 작성 모달 */}
      <ArticleCreate active={active} setActive={setActive} />
    </>
  )
}