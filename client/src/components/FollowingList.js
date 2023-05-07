import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getFollowings } from "../utils/requests";
import Spinner from "./Spinner";

export default function FollowingList() {
  
  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getFollowings(username)
      .then(data => {
        setFollowingCount(data.userCount);
        setFollowings([...followings, ...data.users]);
      })
      .catch (error => {
        setError(error)
      })
      .finally(() => setIsLoaded(true))
  }, [])

  const followingList = followings.map(following => (
    <div key={following.username} className="mb-2">
      <Link
        to={`/profiles/${following.username}`}
        className="inline-flex items-center"
      >
        <img
          src={`${process.env.REACT_APP_SERVER}/files/profiles/${following.image}`}
          className="w-12 h-12 object-cover rounded-full"
        />
        <div className="ml-2">
          <span className="block font-semibold">
            {following.username}
          </span>
          <span className="block text-gray-400 text-sm">
            {following.fullName}
          </span>
        </div>
      </Link>
    </div>
  ))


  return (
    <div className="px-2">
      <h1 className="text-2xl my-4 font-semibold">Followings</h1>
      {followingCount > 0 ? (
        <ul>
          {followingList}
        </ul>
      ) : (
        <p className="text-center my-4">User doesn't follow any users</p>
      )}

      {!isLoaded && <Spinner />}
      {error && <p className="text-red-500">{error.message}</p>}
    </div> 
  )
}