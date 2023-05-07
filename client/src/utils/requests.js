// 서버에 요청하는 함수 라이브러리
const server = process.env.REACT_APP_SERVER;

/* USER */
// 유저 생성 요청 함수
export async function createUser(email, fullName, username, password) {
  const res = await fetch(`${server}/users`, { // fetch 응답은 promise
    method: 'POST', // 요청 메서드
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ // JSON.stringify 자바스크립트 객체를 제이슨형식(문자)으로 바꿔주는 메서드
      email, 
      fullName, 
      username, 
      password,
    })
  });

  if (!res.ok) { // status가 200이 아닐 경우
    throw new Error(`${res.status} ${res.statusText}`);// status 코드와 메시지
  }

  return await res.json(); // 200 ok인 경우 postman에서 응답온 데이터를 자바스크립트 객체로
}

// 로그인 요청 함수
export async function signIn(email, password) {
  const res = await fetch(`${server}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 회원 정보 수정
export async function updateProfile(formData) {
  const res = await fetch(`${server}/user`, {
    method: "PUT",
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token }, // localStorage에 저장된 토큰을 헤더에 담아서 요청
    body: formData, // file이 있는 경우. json타입으로는 파일을 전송할 수 없음
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 유저 검색
export async function searchUsers(username) {
  const res = await fetch(`${server}/users/?username=${username}`, { //username은 쿼리로 전송 (쿼리나 파람 - 데이터 크기가 작을때)
    // 메서드 생략되면 GET임. GET메서드는 body를 가질 수 없음.
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 이메일로 유저 검색 - 회원가입할때 중복확인
export async function doesEmailExists(email) {
  const res = await fetch(`${server}/users/?email=${email}`);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  const { userCount } = await res.json();

  // 같은 이메일이 존재하면 true를 반환
  return userCount > 0;
}


/* ARTICLES */
// 피드
export async function getFeed(skip) {
  const res = await fetch(`${server}/feed?skip=${skip}`, {
    headers: { "Authorization" : "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
};

// 게시물 하나 가져오기
export async function getArticle(id) {
  const res = await fetch(`${server}/articles/${id}`, {
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 게시물 생성
export async function createArticle(formData) {
  const res = await fetch(`${server}/articles`, {
    method: "POST",
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
    body: formData, // 이미지파일이 있어서 formData 사용
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 게시물 삭제
export async function deleteArticle(id) {
  const res = await fetch(`${server}/articles/${id}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 좋아요
export async function favorite(id) {
  const res = await fetch(`${server}/articles/${id}/favorite`, {
    method: "POST",
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 좋아요 취소
export async function unfavorite(id) {
  const res = await fetch(`${server}/articles/${id}/favorite`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}


/* COMMENTS */
// 댓글 가져오기
export async function getComments(id) {
  const res = await fetch(`${server}/articles/${id}/comments`, {
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 댓글 생성
export async function createComment(id, content) {
  const res = await fetch(`${server}/articles/${id}/comments`, {
    method : "POST",
    headers: {
      "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 댓글 삭제
export async function deleteComment(id) { // id: 댓글의 id
  const res = await fetch(`${server}/comments/${id}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}


/* PROFILES */
// 프로필 가져오기
export async function getProfile(username) {
  const res = await fetch(`${server}/profiles/${username}`, {
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 타임라인 가져오기
export async function getTimeline(username) {
  const res = await fetch(`${server}/articles/?username=${username}`, { // 작성자가 username
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 팔로워 목록 가져오기
export async function getFollowers(username) {
  const res = await fetch(`${server}/users/?followers=${username}`, {
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 팔로잉 목록 가져오기
export async function getFollowings(username) {
  const res = await fetch(`${server}/users/?following=${username}`, {
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 팔로우
export async function follow(username) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
    method: "POST",
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 언팔로우
export async function unfollow(username) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}