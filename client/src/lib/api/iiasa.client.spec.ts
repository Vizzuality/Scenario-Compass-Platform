import { describe, it, expect, vi, beforeEach } from "vitest";
import { Scenario } from "@iiasa/ixmp4-ts";
import { IIASA_API_CLIENT } from "./iiasa.client";

describe("IIASA API Client", () => {
  let apiClient: IIASA_API_CLIENT;

  beforeEach(() => {
    apiClient = new IIASA_API_CLIENT({
      appName: "testApp",
      baseUrl: "https://test.api",
    });
  });

  it("should initialize Index client and set tokens", async () => {
    const mockCredentials = {
      access: "mockAccessToken",
      refresh: "mockRefreshToken",
    };

    vi.spyOn(apiClient as never, "getAPICredentials").mockResolvedValue(mockCredentials);
    vi.spyOn(apiClient as never, "setPlatform").mockResolvedValue(undefined);

    await apiClient.init({ username: "username", password: "password" });

    expect(apiClient.accessToken).toBe("mockAccessToken");
    expect(apiClient.refreshToken).toBe("mockRefreshToken");
    expect(apiClient.isAuthenticated()).toBe(true);
  });

  it("should throw an error if username or password is not set", async () => {
    await expect(apiClient.init({ username: "", password: "" })).rejects.toThrow(
      "Either username or password is not set.",
    );
  });

  it("should refresh tokens and set platform", async () => {
    const mockTokens = {
      access: "newAccessToken",
      refresh: "newRefreshToken",
    };

    apiClient.refreshToken = "mockRefreshToken";

    vi.spyOn(apiClient as never, "refreshAccessToken").mockResolvedValue(mockTokens);
    vi.spyOn(apiClient as never, "setPlatform").mockResolvedValue(undefined);

    await apiClient.refreshOrObtainAccessToken();

    expect(apiClient.accessToken).toBe("newAccessToken");
    expect(apiClient.refreshToken).toBe("newRefreshToken");
    expect(apiClient.setPlatform).toHaveBeenCalledWith("newAccessToken");
  });

  it("should throw an error if refresh token is not set", async () => {
    apiClient.refreshToken = undefined;

    await expect(apiClient.refreshOrObtainAccessToken()).rejects.toThrow(
      "Refresh token is not set.",
    );
  });

  it("should list scenarios", async () => {
    const mockScenarios: Scenario["dataModel"][] = [
      {
        id: 1,
        name: "Test Scenario 1",
        created_at: new Date().toString(),
        created_by: new Date().toString(),
      },
      {
        id: 2,
        name: "Test Scenario 2",
        created_at: new Date().toString(),
        created_by: new Date().toString(),
      },
    ];
    apiClient.platform = {
      scenarios: {
        list: vi.fn().mockResolvedValue(mockScenarios),
      },
    } as never;

    const scenarios = await apiClient.getScenarios();

    expect(scenarios).toEqual(mockScenarios);
  });
});
