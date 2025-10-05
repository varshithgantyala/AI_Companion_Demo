# AI Companion Backend (FastAPI)

This backend server, built with FastAPI, provides the necessary signaling and API endpoints for the AI Companion video chat application.

## Quick Start

1.  **Create a Virtual Environment**:
    It's recommended to isolate project dependencies.
    ```bash
    python -m venv .venv
    source .venv/bin/activate
    # On Windows, use: .venv\Scripts\activate
    ```

2.  **Install Dependencies**:
    Install all required Python packages from `requirements.txt`.
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the Server**:
    This command starts the Uvicorn ASGI server, which will run the FastAPI and Socket.IO application. The `--reload` flag enables hot-reloading for development.
    ```bash
    uvicorn main:socket_app --reload --port 8000
    ```
    The server will be running at `http://localhost:8000`.

## API Endpoints & Signaling

-   **Signaling**: The WebSocket server is available at the `/signal` path and handles WebRTC negotiation events (`offer`, `answer`, `candidate`).
-   **REST API**:
    -   `POST /api/video/rooms`: Creates a new unique room for a video call.
    -   `GET /api/companions`: Proxies a request to an external service to fetch a list of available AI companions.

## Production Notes

-   **TURN Server**: The current WebRTC configuration uses a public STUN server and a demo TURN server. For a production environment, you must configure your own secure TURN server to handle NAT traversal reliably.
-   **CORS**: Cross-Origin Resource Sharing (CORS) is currently configured to allow all origins (`*`) for simplicity. In production, this should be restricted to your specific frontend domain.
-   **Secrets**: Any sensitive information, such as API keys or credentials, should be managed via environment variables or a secrets management system.