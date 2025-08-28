import {
  IAuth,
  Platform,
  Scenario,
  ScenarioFilter,
  VariableFilter,
  IamcDataFilter,
  MetaIndicatorFilter,
  ModelFilter,
  DataFrame,
  RunFilter,
  Run,
} from "@iiasa/ixmp4-ts";
import * as z from "zod/v4";

export const IIASAConfigSchema = z.object({
  appName: z.string(),
  baseUrl: z.url(),
});

export const CredentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type IIASAConfig = z.infer<typeof IIASAConfigSchema>;
export type Credentials = z.infer<typeof CredentialsSchema>;

const API_MANAGER_URLS = {
  baseUrl: "https://api.manager.ece.iiasa.ac.at",
  tokenObtain: "/v1/token/obtain",
  tokenRefresh: "/v1/token/refresh",
} as const;

export class IIASA_API_CLIENT {
  appName: IIASAConfig["appName"];
  baseUrl: IIASAConfig["baseUrl"];
  platform: Platform | undefined;
  accessToken: IAuth["accessToken"];
  refreshToken: IAuth["accessToken"];

  constructor({
    appName,
    baseUrl,
  }: {
    appName: IIASAConfig["appName"];
    baseUrl: IIASAConfig["baseUrl"];
  }) {
    this.appName = appName;
    this.baseUrl = baseUrl;
  }

  public async init({ username, password }: Credentials) {
    const credentials = await this.getAPICredentials({
      username,
      password,
    });

    this.accessToken = credentials.access;
    this.refreshToken = credentials.refresh;

    await this.setPlatform(credentials.access);
  }

  public isAuthenticated() {
    return !!this.accessToken;
  }

  private async getAPICredentials({ username, password }: Credentials) {
    if (!username || !password) {
      throw new Error("Either username or password is not set.");
    }

    const formData = new FormData();

    formData.set("username", username);
    formData.set("password", password);

    const request = await fetch(`${API_MANAGER_URLS.baseUrl}${API_MANAGER_URLS.tokenObtain}`, {
      method: "POST",
      body: formData,
    });

    return (await request.json()) as {
      access: IAuth["accessToken"];
      refresh: IAuth["accessToken"];
    };
  }

  private validatePlatform(): asserts this is this & { platform: Platform } {
    if (!this.platform) {
      throw new Error("Platform is not initialized.");
    }
  }

  public async setPlatform(accessToken: IAuth["accessToken"]) {
    this.platform = await Platform.create({
      name: this.appName,
      baseUrl: this.baseUrl,
      auth: {
        accessToken: accessToken,
        refreshOrObtainAccessToken: this.refreshOrObtainAccessToken,
      },
    });
  }

  public async refreshOrObtainAccessToken() {
    if (!this.refreshToken) {
      throw new Error("Refresh token is not set.");
    }

    const credentials = await this.refreshAccessToken(this.refreshToken);
    this.accessToken = credentials.access;
    this.refreshToken = credentials.refresh;

    await this.setPlatform(this.accessToken);
  }

  private async refreshAccessToken(refreshToken: IAuth["accessToken"]) {
    if (!refreshToken) {
      throw new Error("Refresh token is not set.");
    }

    const formData = new FormData();
    formData.set("refresh", refreshToken);

    const request = await fetch(`${API_MANAGER_URLS.baseUrl}${API_MANAGER_URLS.tokenRefresh}`, {
      method: "POST",
      body: formData,
    });

    if (!request.ok) {
      throw new Error("Failed to refresh access token.");
    }

    return (await request.json()) as {
      access: IAuth["accessToken"];
      refresh: IAuth["accessToken"];
    };
  }

  public async getScenariosList(filters?: ScenarioFilter): Promise<Scenario[]> {
    this.validatePlatform();
    return this.platform.scenarios.list(filters);
  }

  public async getScenariosTabulate(filters?: ScenarioFilter): Promise<DataFrame> {
    this.validatePlatform();
    return this.platform.scenarios.tabulate(filters);
  }

  public getVariablesList(filters?: VariableFilter) {
    this.validatePlatform();
    return this.platform.iamc.variables.list(filters);
  }

  public getMetaIndicators(filters?: MetaIndicatorFilter) {
    this.validatePlatform();
    return this.platform.meta.tabulate({ joinRunIndex: false, ...filters });
  }

  public getModelsTabulate(filters?: ModelFilter) {
    this.validatePlatform();
    return this.platform.models.tabulate(filters);
  }

  public getModelsList(filters?: ModelFilter) {
    this.validatePlatform();
    return this.platform.models.list(filters);
  }

  public getDataTabulatedPoints(filters?: IamcDataFilter) {
    this.validatePlatform();
    return this.platform.iamc.tabulate({ joinRunId: true, ...filters });
  }

  public getTabulatedRuns(filters?: RunFilter) {
    this.validatePlatform();
    return this.platform.runs.tabulate(filters);
  }

  public async getRuns(filters?: RunFilter): Promise<Run[]> {
    this.validatePlatform();
    return this.platform.runs.list(filters);
  }

  public getRunDetails(id: number) {
    this.validatePlatform();
    return this.platform.runs.list({
      id,
    });
  }
}
