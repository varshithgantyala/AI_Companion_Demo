# AI Companion Video Calling Demo

This repository contains a complete, full-stack demonstration of an "AI Companion" video chat application. It was built to showcase real-time communication using WebRTC for peer-to-peer media streaming and a WebSocket-based signaling server.

## Project Structure

The project is divided into two main parts:

-   **`/frontend`**: A Next.js and TypeScript application that provides the user interface. It includes components for selecting a companion, initiating a video call, and a custom `useWebRTC` hook to manage the media stream and peer connection logic.
-   **`/backend`**: A FastAPI (Python) application that serves as the signaling server using `python-socketio`. It also includes REST endpoints to create video rooms and fetch a list of available companions.

## Core Features

-   **WebRTC Video Chat**: Establishes a direct peer-to-peer video and audio connection between the user and the companion placeholder.
-   **Socket.IO Signaling**: Manages the WebRTC session negotiation (offers, answers, and ICE candidates) between peers.
-   **RESTful API**: Provides simple endpoints for room management and fetching companion data.
-   **Decoupled Frontend & Backend**: Allows for independent development, testing, and deployment.

## Getting Started

To run the full application locally, you must run both the frontend and backend servers. Please follow the setup instructions in the `README.md` file inside each respective directory.
