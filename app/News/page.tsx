'use client'

// app/news/page.tsx
import { useEffect, useState } from "react";
import axios from "axios";

const News = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [category, setCategory] = useState("technology");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const API_KEY = "3e4f2f0a1d2a4e9791ca564f26769ce2"; // Replace with your NewsAPI.org API key

  const categories = ["technology", "sports", "business", "health", "entertainment"];

  const fetchNews = async (category: string, page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=${category}&country=us&pageSize=10&page=${page}&apiKey=${API_KEY}`
      );
      setArticles((prev) => (page === 1 ? response.data.articles : [...prev, ...response.data.articles]));
    } catch (error) {
      console.error("Error fetching news:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews(category, page);
  }, [category, page]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1); // Reset to first page for new category
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to check if title or description contains '[Removed]'
  const isRemoved = (text: string) => {
    return text.includes("[Removed]");
  };

  return (
    <div>
      <h1>Latest News</h1>
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={cat === category ? "active" : ""}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <div className="articles">
        {articles.map((article, index) => {
          const { title, description, url, urlToImage } = article;
          const articleTitle =  title;
          const articleDescription = description;

          return (
            <div className="article" key={index}>
              <h2>{articleTitle}</h2>
              {urlToImage && <img src={urlToImage} alt={title} />}
              <p>{articleDescription}</p>
              {!isRemoved(title) && (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              )}
            </div>
          );
        })}
        {loading && <p>Loading more articles...</p>}
      </div>

      <style jsx>{`
        div {
          font-family: Arial, sans-serif;
        }
        h1 {
          text-align: center;
          color: #2c3e50;
        }
        .categories {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }
        .categories button {
          margin: 0 5px;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          background-color: #3498db;
          color: white;
        }
        .categories .active {
          background-color: #2980b9;
        }
        .articles {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          padding: 20px;
        }
        .article {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
          background: #fff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .article img {
          max-width: 100%;
          border-radius: 5px;
        }
        .article h2 {
          font-size: 20px;
          color: #2c3e50;
        }
        .article p {
          font-size: 14px;
          color: #34495e;
        }
        .article a {
          color: #3498db;
          text-decoration: none;
        }
        .article a:hover {
          text-decoration: underline;
        }
        .article .removed {
          color: #e74c3c;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default News;
