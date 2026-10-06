import axios from "axios";

const httpRequest = axios.create({
    baseURL: "/api",
    headers: { accept: "application/json" },
    timeout: 10000,
});

export function now_playing() {
    
}