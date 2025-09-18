import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, ArrowUp } from "lucide-react";

const ACCESS_KEY = "gzNaf8OB0IPcelCvc0TeL8iCrQZxhYfn-PEmzAaHgMc";

export default function ImageSearch() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showScroll, setShowScroll] = useState(false);

  const containerRef = useRef(null);

  const searchImages = async (e, reset = true) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    if (reset) {
      setPage(1);
      setImages([]);
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?page=${reset ? 1 : page}&query=${query}&client_id=${ACCESS_KEY}&per_page=20`
      );
      const data = await res.json();

      setTotal(data.total || 0);

      if (reset) {
        setImages(data.results || []);
      } else {
        setImages((prev) => [...prev, ...(data.results || [])]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Fetch more images when page changes (infinite scroll ready)
  useEffect(() => {
    if (page > 1) {
      searchImages(null, false);
    }
    // eslint-disable-next-line
  }, [page]);

  // Scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center p-6"
    >
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800 tracking-tight">
        🖼️ Image Search Engine
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={(e) => searchImages(e, true)}
        className="flex items-center w-full max-w-2xl bg-white rounded-full shadow-lg overflow-hidden ring-2 ring-transparent focus-within:ring-blue-400 transition"
      >
        <input
          type="text"
          placeholder="Search stunning images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-3 outline-none text-gray-700"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 flex items-center hover:bg-blue-600 transition"
        >
          <Search size={22} />
        </button>
      </form>

      {/* Total Results */}
      {total > 0 && (
        <p className="mt-4 text-gray-600">
          Found <span className="font-semibold">{total}</span> results
        </p>
      )}

      {/* Loader */}
      {loading && (
        <div className="flex justify-center mt-10">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      )}

      {/* Image Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 w-full max-w-7xl">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group rounded-xl overflow-hidden shadow-md bg-white"
          >
            <img
              src={img.urls.small}
              alt={img.alt_description}
              className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-3 transition">
              <p className="text-white text-sm mb-2 truncate">
                📸 {img.user.name}
              </p>
              <a
                href={img.links.html}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black text-xs px-3 py-1 rounded-lg hover:bg-gray-200 transition"
              >
                View on Unsplash
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {images.length > 0 && !loading && (
        <button
          onClick={loadMore}
          className="mt-8 px-6 py-3 bg-blue-500 text-white font-medium rounded-full shadow-md hover:bg-blue-600 transition"
        >
          Load More
        </button>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && query && (
        <p className="mt-10 text-gray-500">No images found. Try another search!</p>
      )}

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
