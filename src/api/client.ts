import axios from "axios";
import { getAdminToken } from "../utils/adminStorage";

const client = axios.create({
  baseURL: "http://localhost:5500/api",
});

client.interceptors.request.use((config) => {
  const token = getAdminToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;
