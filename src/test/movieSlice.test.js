import moviesSlice, { fetchMovies } from "../data/moviesSlice";
import { moviesMock } from "./movies.mocks";

describe("MovieSlice test", () => {
  it("should set loading true while action is pending", () => {
    const action = { type: fetchMovies.pending };
    const initialState = moviesSlice(
      {
        movies: [],
        fetchStatus: "",
      },
      action
    );
    expect(action).toEqual({ type: fetchMovies.pending });
  });

  it("should return payload when action is fulfilled", () => {
    const action = {
      type: fetchMovies.fulfilled,
      payload: { movies: moviesMock, page: 1 },
    };
    const initialState = moviesSlice(
      {
        movies: [],
        fetchStatus: "",
      },
      action
    );
    expect(initialState.movies).toEqual(moviesMock);
    expect(initialState.fetchStatus).toBe("success");
    expect(initialState.page).toBe(1);
  });

  it("should set error when action is rejected", () => {
    const action = { type: fetchMovies.rejected };
    const initialState = moviesSlice(
      {
        movies: [],
        fetchStatus: "",
      },
      action
    );
    expect(action).toEqual({ type: fetchMovies.rejected });
  });
});
