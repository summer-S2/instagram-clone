import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getFollowers } from "../utils/requests";
import Spinner from "./Spinner";

export default function FollowerList() {

  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getFollowers(username)
      .then(data => {
        setFollowerCount(data.userCount);
        setFollowers([...followers, ...data.users]);
      })
      .catch (error => {
        setError(error)
      })
      .finally(() => setIsLoaded(true))
  }, [])

  const followerList = followers.map(follower => (
    <div key={follower.username} className="mb-2">
      <Link
        to={`/profiles/${follower.username}`}
        className="inline-flex items-center"
      >
        <img
          src={`${process.env.REACT_APP_SERVER}/files/profiles/${follower.image}`}
          className="w-12 h-12 object-cover rounded-full"
        />
        <div className="ml-2">
          <span className="block font-semibold">
            {follower.username}
          </span>
          <span className="block text-gray-400 text-sm">
            {follower.fullName}
          </span>
        </div>
      </Link>
    </div>
  ))

  return (
    <div className="px-2">
      <h1 className="text-2xl my-4 font-semibold">Followers</h1>
      {followerCount > 0 ? (
        <ul>
          {followerList}
        </ul>
      ) : (
        <p className="text-center my-4">User has no followers</p>
      )}

      {!isLoaded && <Spinner />}
      {error && <p className="text-red-500">{error.message}</p>}
    </div> 
  )
  
}