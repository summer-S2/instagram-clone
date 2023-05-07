import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../utils/requests";

export default function ArticleCreate({ active, setActive }) { // props: Profile component
  
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  console.log(files);

  // 폼 제출처리
  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const formData = new FormData();

      // formData에 사진 추가
      for (let file of files) {
        formData.append('images', file);
      }

      // formData에 사진설명 추가
      formData.append('description', description);

      await createArticle(formData);

      // feed로 이동
      navigate('/');

    } catch (error) {
      alert(error);
    }
  }

  // 모달 창 닫기
  function close(e) {
    if (e.target === e.currentTarget) {
      setActive(false);
    }
  }

  // 게시물 생성 모달은 active가 true일때만 return
  if (active) {
    return (
      <div className="fixed inset-0 bg-black/[0.2] z-10" onClick={close}>
        <button
          type="button"
          className="float-right text-2xl px-4 py-2 text-white"
          onClick={() => setActive(false)}
        >
          &times;
        </button>

        <form
          className="bg-white max-w-xs mt-20 mx-auto rounded-2xl"
          onSubmit={handleSubmit}
        >
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-center">Create new post</h3>
          </div>
          <div className="p-4">
            <label className="inline-block mb-2 font-semibold text-sm px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={({ target }) => setFiles(Array.from(target.files))} // Array.from : 순회할 수 있는 객체면 array로 변환해주는 메서드
                multiple={true}
                accept="image/*"
              />
              Select Photos +
            </label>

            {/* 이미지 미리보기 */}
            {files.length > 0 && (
              <ul className="grid grid-cols-3 gap-1 mb-2">
                {files.map(file => (
                  <li key={file.name} className="pt-[100%] relative">
                    <img
                      className="absolute inset-0 w-full h-full object-cover"
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                    />
                  </li>
                ))}
              </ul>
            )}

            {/* 사진 설명 */}
            <div className="mb-2">
              <label
                htmlFor="description"
                className="block font-semibold"
              >
                Description
              </label>
              <textarea
                rows="2"
                id="description"
                className="block w-full px-2 py-1 rounded border"
                onChange={({ target }) => setDescription(target.value)}
                value={description}
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-blue-500 rounded-lg text-white disabled:opacity-[0.2]"
              disabled={files.length < 1}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    )
  }


}