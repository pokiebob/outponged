import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchAuthSession } = vi.hoisted(() => ({ fetchAuthSession: vi.fn() }));

vi.mock("aws-amplify/auth", () => ({ fetchAuthSession }));

import { ApiError, authenticatedFetch } from "./api-client";

describe("authenticatedFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    fetchAuthSession.mockReset();
  });

  it("adds the current Cognito ID token as a bearer token", async () => {
    fetchAuthSession.mockResolvedValue({
      tokens: { idToken: { toString: () => "signed-id-token" } },
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await authenticatedFetch("https://api.example.test/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.get("Authorization")).toBe("Bearer signed-id-token");
    expect(init.headers.get("Content-Type")).toBe("application/json");
  });

  it("fails locally when there is no authenticated token", async () => {
    fetchAuthSession.mockResolvedValue({});
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(authenticatedFetch("https://api.example.test/post", { method: "POST" }))
      .rejects.toMatchObject({ name: "ApiError", status: 401 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not treat a rejected API mutation as successful", async () => {
    fetchAuthSession.mockResolvedValue({
      tokens: { idToken: { toString: () => "signed-id-token" } },
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ message: "Administrator authorization is required" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    )));

    await expect(authenticatedFetch("https://api.example.test/club", { method: "POST" }))
      .rejects.toEqual(expect.objectContaining({
        name: "ApiError",
        status: 403,
        message: "Administrator authorization is required",
      }));
  });
});
