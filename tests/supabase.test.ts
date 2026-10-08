import { describe, it, expect } from "vitest";
import { supabase } from "../src/lib/supabase";

const hasConfig =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

describe.skipIf(!hasConfig)("Supabase live", () => {
  it("has no session when signed out", async () => {
    const { data, error } = await supabase.auth.getSession();

    expect(error).toBeNull();
    expect(data.session).toBeNull();
  });

  it("builds a Google OAuth URL that returns to the given redirect", async () => {
    const redirectTo = "http://localhost:3000/";
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo, skipBrowserRedirect: true },
    });

    expect(error).toBeNull();

    const url = new URL(data.url!);
    expect(url.origin).toBe(new URL(import.meta.env.VITE_SUPABASE_URL).origin);
    expect(url.pathname).toBe("/auth/v1/authorize");
    expect(url.searchParams.get("provider")).toBe("google");
    expect(url.searchParams.get("redirect_to")).toBe(redirectTo);
  });
});
