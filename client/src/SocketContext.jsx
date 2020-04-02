import socketIOClient from "socket.io-client";

const endpoint = "localhost:8000";
const socket = socketIOClient(endpoint);

export default socket;