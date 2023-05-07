import { useState, useEffect, useContext } from "react";
import ArticleTemplate from "./ArticleTemplate";
import { getFeed, deleteArticle, favorite, unfavorite } from "../utils/requests"
import Spinner from "./Spinner";

const limit = 5; // 게시물 최대 5개씩

export default function Feed() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [articles, setArticles] = useState([]);
  const [skip, setSkip] = useState(0);
  const [articleCount, setArticleCount] = useState(0);

  useEffect(() => {
    setError(null);
    setIsLoaded(false);

    getFeed(skip)
      .then(data => {
        setArticleCount(data.articleCount);

        const updatedArticles = [...articles, ...data.articles];
        setArticles(updatedArticles);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => setIsLoaded(true));
  }, [skip])

  // console.log(articles);
  // console.log(articleCount);

  async function handleFavorite(id) {
    try {
      await favorite(id);

      const updatedArticles = articles.map(article => {
        if (article.id === id) { // 조건이 일치하는 아티클만 정보 업데이트
          return {
            ...article,
            isFavorite: true,
            favoriteCount: article.favoriteCount + 1,
          }
        }
        return article;
      })

      setArticles(updatedArticles);

    } catch (error) {
      alert(error);
    }
  }

  async function handleUnfavorite(id) {
    try {
      await unfavorite(id);

      const updatedArticles = articles.map(article => {
        if (article.id === id) {
          return {
            ...article,
            isFavorite: false,
            favoriteCount: article.favoriteCount - 1,
          }
        }

        return article;

      })

      setArticles(updatedArticles);

    } catch (error) {
      alert(error);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteArticle(id);

      const remainingArticles = articles.filter(article => id !== article.id);

      setArticles(remainingArticles);

    } catch (error) {
      alert(error);
    }
  }

  const articleList = articles.map(article => (
    <li key={article.id} className="border-b pb-4">
      <ArticleTemplate 
        article={article}
        handleFavorite={handleFavorite}
        handleUnfavorite={handleUnfavorite}
        handleDelete={handleDelete}
      />
    </li>
  ))

  // 더보기 버튼
  const moreButton = (articleCount > limit && articleCount > articles.length) && (
    <div className="flex justify-center my-2">
      <button
        className="p-1 text-blue-500"
        onClick={() => setSkip(skip + limit)}
      >
        More
      </button>
    </div>
  )

  return (
    <>
      <ul className="">
        {articleList}
      </ul>

      {isLoaded ? moreButton : <Spinner />}
      {error && <p className="text-red-500">{error.message}</p>}
    </>
  )

}