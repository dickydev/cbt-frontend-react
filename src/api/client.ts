import axios from "axios";
import { getAdminToken } from "../utils/adminStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5500/api";

const client = axios.create({
  baseURL: API_BASE_URL,
});
client.interceptors.request.use((config) => {
  const token = getAdminToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;
