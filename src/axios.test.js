import { describe, expect, it } from "vitest";

import instance from "./axios";

describe("public API client", () => {
  it("does not attach placeholder authentication to public requests", () => {
    expect(instance.defaults.headers.common.Authorization).toBeUndefined();
  });
});
