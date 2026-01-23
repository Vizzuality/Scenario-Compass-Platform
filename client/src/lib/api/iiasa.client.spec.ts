import { describe, it, expect, vi, beforeEach } from "vitest";
import { Scenario, Platform } from "@iiasa/ixmp4-ts";
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

    const mockPlatform = {} as Platform;

    vi.spyOn(apiClient as never, "getAPICredentials").mockResolvedValue(mockCredentials);
    vi.spyOn(Platform, "create").mockResolvedValue(mockPlatform);

    await apiClient.init({ username: "username", password: "password" });

    expect(apiClient["auth"]?.accessToken).toBe("mockAccessToken");
    expect(apiClient["refreshToken"]).toBe("mockRefreshToken");
    expect(apiClient.isAuthenticated()).toBe(true);
    expect(apiClient.platform).toBe(mockPlatform);
  });

  it("should throw an error if username or password is not set", async () => {
    await expect(apiClient.init({ username: "", password: "" })).rejects.toThrow(
      "Either username or password is not set.",
    );
  });

  it("should refresh tokens and update auth object", async () => {
    const mockTokens = {
      access: "newAccessToken",
      refresh: "newRefreshToken",
    };

    apiClient["auth"] = {
      accessToken: "oldAccessToken",
      refreshOrObtainAccessToken: vi.fn(),
    };
    apiClient["refreshToken"] = "mockRefreshToken";

    vi.spyOn(apiClient as never, "refreshAccessToken").mockResolvedValue(mockTokens);

    await apiClient.refreshOrObtainAccessToken();

    expect(apiClient["auth"]?.accessToken).toBe("newAccessToken");
    expect(apiClient["refreshToken"]).toBe("newRefreshToken");
  });

  it("should throw an error if refresh token is not set", async () => {
    apiClient["refreshToken"] = null;

    await expect(apiClient.refreshOrObtainAccessToken()).rejects.toThrow(
      "Auth or refresh token is not set.",
    );
  });

  it("should throw an error if auth is not initialized", async () => {
    apiClient["auth"] = undefined;
    apiClient["refreshToken"] = "mockRefreshToken";

    await expect(apiClient.refreshOrObtainAccessToken()).rejects.toThrow(
      "Auth or refresh token is not set.",
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

    const scenarios = await apiClient.getScenariosList();

    expect(scenarios).toEqual(mockScenarios);
  });

  it("should handle undefined refresh token with ?? null", async () => {
    const mockCredentials = {
      access: "mockAccessToken",
      refresh: undefined,
    };

    const mockPlatform = {} as Platform;

    vi.spyOn(apiClient as never, "getAPICredentials").mockResolvedValue(mockCredentials);
    vi.spyOn(Platform, "create").mockResolvedValue(mockPlatform);

    await apiClient.init({ username: "username", password: "password" });

    expect(apiClient["refreshToken"]).toBe(null);
  });
});
