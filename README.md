# Scenario-Compass-Platform

## Description

Scenario-Compass-Platform is an advanced platform designed to facilitate scenario-based decision making and analysis. It empowers teams to systematically map, compare, and evaluate diverse scenarios, supporting informed choices in complex environments. Through its structured tools for scenario planning, the platform enables organizations to visualize potential outcomes, assess associated risks, and make well-founded decisions with greater confidence.

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker & Docker Compose
- Git

### environment Variables

- Create a `.env` file in each service directory (`client` and `science`) with the necessary environment variables. You can refer to the `.env.example` files in each directory for guidance.

### Getting Started (Local)

1. Clone the repository
2. Install dependencies
3. Run the development server

### Running with Docker Compose

This project is structured with `client` and `science` folders. To run both services using Docker Compose:

1. Ensure Docker and Docker Compose are installed.
2. From the project root, run:

    ```bash
    docker-compose up --build
    ```

3. The `client` app will be available at [http://localhost:3001](http://localhost:3001) and the `science` service at [http://localhost:8887](http://localhost:8887) (check your `docker-compose.yml` for specifics).

