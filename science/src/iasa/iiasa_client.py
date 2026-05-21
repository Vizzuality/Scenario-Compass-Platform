import os
import requests


class IIASABaseAPIClient:
    def __init__(self):
        self.app_name = os.getenv("NEXT_PUBLIC_API_APP_NAME", "scenariocompass").strip("/")

        self.base_url = os.getenv(
            "NEXT_PUBLIC_API_BASE_URL",
            "https://ixmp.ece.iiasa.ac.at/v1",
        ).rstrip("/")

        self.data_api_url = f"{self.base_url}/{self.app_name}"

        self.headers = {
            "accept": "application/json",
            "accept-language": "en,es;q=0.9,gl;q=0.8",
            "content-type": "application/json",
            "dnt": "1",
            "origin": "https://scenariocompass-dev.apps.ece.iiasa.ac.at",
            "referer": "https://scenariocompass-dev.apps.ece.iiasa.ac.at/",
            "user-agent": "Mozilla/5.0",
        }

    def get_data(self, endpoint, params=None, body=None):
        endpoint = endpoint if endpoint.startswith("/") else f"/{endpoint}"
        url = f"{self.data_api_url}{endpoint}"

        response = requests.patch(
            url,
            json=body or {},
            headers=self.headers,
            params=params,
        )

        response.raise_for_status()
        return response.json()