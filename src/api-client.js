import { fetchAuthSession } from "aws-amplify/auth";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function authenticatedFetch(input, init = {}) {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new ApiError(401, "Authentication is required");

  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${idToken}`);

  const response = await fetch(input, { ...init, headers });
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.clone().json();
      if (typeof body?.message === "string") message = body.message;
    } catch {
      // Keep the status-only message for non-JSON errors.
    }
    throw new ApiError(response.status, message);
  }
  return response;
}
