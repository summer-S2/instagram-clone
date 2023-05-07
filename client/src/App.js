import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from './components/AuthProvider';
import AuthRequired from './components/AuthRequired';
import Layout from './components/Layout';
import Feed from './components/Feed';
import ArticleView from './components/ArticleView';
import Comments from './components/Comments';
import Search from './components/Search';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import FollowerList from './components/FollowerList';
import FollowingList from './components/FollowingList';
import Accounts from './components/Accounts';
import NotFound from './components/NotFound';



function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          
          {/* 인증이 필요한 라우트 */}
          <Route path="/" element={
            <AuthRequired>
              <Layout />
            </AuthRequired>
          }>
            <Route index element={<Feed />} />
            <Route path="search" element={<Search />} />
            <Route path="p/:id"> 
              <Route index element={<ArticleView />} />{/* index는 부모의 path를 물려받음 */}
              <Route path="comments" element={<Comments />} />{/* 자식의 path는 부모 path뒤에 붙음 p/:id/comments */}
            </Route>
            <Route path="profiles/:username">
              <Route index element={<Profile />} />
              <Route path="followers" element={<FollowerList />} />
              <Route path="following" element={<FollowingList />} />
            </Route>
            <Route path="accounts/edit" element={<Accounts />} />
          </Route>

          {/* 인증이 필요하지 않은 라우트 */}
          <Route path="accounts/login" element={<Login />} />
          <Route path="accounts/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App;
