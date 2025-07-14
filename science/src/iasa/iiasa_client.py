"""
IIASA API Client for Scenario Compass Platform

This module provides a client for interacting with the IIASA API
to retrieve scenario data and metadata.
"""

import os
import time
import requests


class IIASABaseAPIClient:
    def __init__(self):
        self.base_url = "https://api.manager.ece.iiasa.ac.at/v1"
        self.token_url = f"{self.base_url}/token/obtain"
        self.headers = {
            "accept": "application/json",
            "accept-language": "en,es;q=0.9,gl;q=0.8",
            "content-type": "application/json",
            "dnt": "1",
            "origin": "https://scenariocompass-dev.apps.ece.iiasa.ac.at",
            "priority": "u=1, i",
            "referer": "https://scenariocompass-dev.apps.ece.iiasa.ac.at/",
            "sec-ch-ua": '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/",
        }
        self._authenticate()
        self.token_timeout = 3600
        self._set_data_api_url()

    def _authenticate(self):
        username = os.getenv("IIASA_USERNAME")
        password = os.getenv("IIASA_PASSWORD")
        if not username or not password:
            raise ValueError("Environment variables IIASA_USERNAME and IIASA_PASSWORD must be set.")
        self.token = self._get_token(username, password)
        self.headers["authorization"] = f"Bearer {self.token}"
        self.token_timeout_start = time.time()

    def _get_token(self, username, password):
        payload = {"username": username, "password": password}
        response = requests.post(self.token_url, json=payload, headers=self.headers)
        response.raise_for_status()
        return response.json().get("access")

    def _set_data_api_url(self):
        # https://api.manager.ece.iiasa.ac.at/v1/ixmp4?slug=scenariocompass-dev
        q_params = {"slug": "scenariocompass-dev"}
        extended_headers = self.headers.copy()
        extended_headers.update({})
        response = requests.get(f"{self.base_url}/ixmp4", headers=extended_headers, params=q_params)
        response.raise_for_status()
        self.data_api_url = response.json().get("results", [])[0].get("url")

    def get_data(self, endpoint, params=None, body=None):
        if time.time() - self.token_timeout_start > self.token_timeout:
            self._authenticate()
        try:
            url = f"{self.data_api_url}{endpoint}"
            # TODO handle paginated responses
            if body:
                response = requests.patch(url, json=body, headers=self.headers, params=params)
            else:
                # you need to explain me why is not a get....
                response = requests.patch(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            self._authenticate()
            self.get_data(endpoint, params, body)
