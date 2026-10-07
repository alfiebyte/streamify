import { describe, it, expect } from "vitest";
import {
  authentication,
  movieListNowPlaying,
  movieListPopular,
  movieListTopRated,
  movieListUpcoming,
} from "../api/_lib/tmdb";

const hasToken = !!process.env.TMDB_ACCESS_TOKEN;

describe.skipIf(!hasToken)("TMDB live", () => {
  it("authentication", async () => {
    const res = await authentication();
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  describe.each([
    ["movieListNowPlaying", movieListNowPlaying],
    ["movieListPopular", movieListPopular],
    ["movieListTopRated", movieListTopRated],
    ["movieListUpcoming", movieListUpcoming],
  ])("%s", (_name, fn) => {
    it("returns a page of movies", async () => {
      const res = await fn({});

      expect(res.status).toBe(200);
      expect(res.data.page).toBe(1);
      expect(res.data.results.length).toBeGreaterThan(0);
      expect(res.data.results[0]).toHaveProperty("id");
      expect(res.data.results[0]).toHaveProperty("title");
    });
  });
});