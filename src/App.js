import { useEffect, useState, useCallback } from "react";
import {
  Routes,
  Route,
  createSearchParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "reactjs-popup/dist/index.css";
import { fetchMovies } from "./data/moviesSlice";
import useInfiniteScroll from "./hooks/useInfiniteScroll.js";
import {
  ENDPOINT_SEARCH,
  ENDPOINT_DISCOVER,
  ENDPOINT,
  API_KEY,
} from "./constants";
import Header from "./components/Header";
import Movies from "./components/Movies";
import Starred from "./components/Starred";
import WatchLater from "./components/WatchLater";
import TrailerModal from "./components/TrailerModal";
import "./app.scss";

const App = () => {
  const state = useSelector((state) => state.movies);
  const { movies } = state;
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [videoKey, setVideoKey] = useState();
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const closeModal = () => setOpen(false);

  const closeCard = () => {};

  const getSearchResults = (query) => {
    if (query !== "") {
      dispatch(
        fetchMovies({ apiUrl: `${ENDPOINT_SEARCH}&query=` + query, page: 1 })
      );
      setSearchParams(createSearchParams({ search: query }));
    } else {
      dispatch(fetchMovies({ apiUrl: ENDPOINT_DISCOVER, page: 1 }));
      setSearchParams();
    }
    setPage(1);
  };

  const searchMovies = (query) => {
    navigate("/");
    getSearchResults(query);
  };

  const getMovies = () => {
    if (searchQuery) {
      const url = `${ENDPOINT_SEARCH}&query=` + encodeURIComponent(searchQuery);
      dispatch(fetchMovies({ apiUrl: url, page: 1 }));
    } else {
      dispatch(fetchMovies({ apiUrl: ENDPOINT_DISCOVER, page: 1 }));
    }
    setPage(1);
  };

  const loadMoreMovies = useCallback(() => {
    const nextPage = page + 1;
    if (searchQuery) {
      const url = `${ENDPOINT_SEARCH}&query=${encodeURIComponent(
        searchQuery
      )}&page=${nextPage}`;
      return dispatch(fetchMovies({ apiUrl: url, page: nextPage })).then(() =>
        setPage(nextPage)
      );
    } else {
      const url = `${ENDPOINT_DISCOVER}&page=${nextPage}`;
      return dispatch(fetchMovies({ apiUrl: url, page: nextPage })).then(() =>
        setPage(nextPage)
      );
    }
  }, [dispatch, searchQuery, page]);

  const [isFetching] = useInfiniteScroll(loadMoreMovies);

  const viewTrailer = (movie) => {
    getMovie(movie.id);
    setOpen(true);
  };

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

    setVideoKey(null);
    const videoData = await fetch(URL).then((response) => response.json());

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(
        (vid) => vid.type === "Trailer"
      );
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className="App">
      <Header
        searchMovies={searchMovies}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <Movies
                movies={movies}
                viewTrailer={viewTrailer}
                closeCard={closeCard}
              />
            }
          />
          <Route
            path="/starred"
            element={<Starred viewTrailer={viewTrailer} />}
          />
          <Route
            path="/watch-later"
            element={<WatchLater viewTrailer={viewTrailer} />}
          />
          <Route
            path="*"
            element={<h1 className="not-found">Page Not Found</h1>}
          />
        </Routes>
      </div>
      <TrailerModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        videoKey={videoKey}
      />
      {isFetching && <p>Loading more movies...</p>}
    </div>
  );
};

export default App;
