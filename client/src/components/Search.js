import { useState, useEffect, useRef } from "react";
import { searchUsers } from "../utils/requests";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

export default function Search() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [users, setUsers] = useState([]);
  const inputEl = useRef(null);

  function handleChange(e) {
    const username = e.target.value;

    if (!username) {
      return setUsers([]);
    }

    setError(null);
    setIsLoaded(false);

    searchUsers(username)
      .then(data => {
        setUsers(data.users);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true));
  }

  useEffect(() => {
    inputEl.current.focus();
  })

  return (
    <div className="px-4">
      <label className="block mt-8 mb-4">
        <input
          type="text"
          className="border px-2 py-1 rounded w-full"
          onChange={handleChange}
          placeholder="Search"
          ref={inputEl}
        />
      </label>

      <Result error={error} isLoaded={isLoaded} users={users} />
    </div>
  )
}


function Result ({ error, isLoaded, users }) {
  // console.log(users)
  if (error) {
    return <p className="text-red-500">{error.message}</p>
  }
  if (!isLoaded) {
    return <Spinner />
  }

  return users.map (user => (
    <div key={user.username} className="flex items-center my-4">
      <Link
        to={`/profiles/${user.username}`}
        className="inline-flex items-center"
      >
        <img
          src={`${process.env.REACT_APP_SERVER}/files/profiles/${user.image}`}
          className="w-12 h-12 object-cover rounded-full"
        />
        <div className="ml-2">
          <span className="block font-semibold">
            {user.username}
          </span>
          <span className="block text-gray-400 text-sm">
            {user.fullName}
          </span>
        </div>
      </Link>
    </div>
  ))
}