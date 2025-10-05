# AI Companion Frontend (Next.js + TypeScript)

This is the client-side application for the AI Companion demo. It's built with Next.js, React, and TypeScript, and it handles all user interactions and WebRTC logic.

## Quick Start

1.  **Install Dependencies**:
    Make sure you have Node.js and npm installed.
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    Create a new file named `.env.local` in this directory (`/frontend`). Copy the contents of `.env.example` if available, or add the following variables. These URLs must point to your running backend server.
    ```
    NEXT_PUBLIC_API_URL=http://localhost:8000
    NEXT_PUBLIC_SIGNAL_URL=http://localhost:8000
    ```

3.  **Run the Development Server**:
    This will start the app on port 3000.
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    Navigate to [http://localhost:3000](http://localhost:3000) to view the application's home page.

## Key Components

-   **`/pages/companions`**: The main page where users can see a list of companions and start a call.
-   **`/components/VideoCallModal.tsx`**: The React component that contains the video elements and manages the lifecycle of a video call.
-   **`/hooks/useWebRTC.ts`**: A custom React hook abstracting the core WebRTC logic, such as accessing user media and managing the `RTCPeerConnection`.