// src/api/axiosInstance.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://api-internhasha.wafflestudio.com",
  headers: {
    "Content-Type": "application/json",
  },
});
