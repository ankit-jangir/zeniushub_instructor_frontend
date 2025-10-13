import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const CheckToken = createAsyncThunk("CheckToken", async ({ token }) => {
  return await tryCatchWrapper(async () => {
    if (!token) {
      throw {
        error: [{ message: "Token not provided" }],
      };
    }


    const res = await fetch(`${BASE_URL}/ping`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw {
        error: [{ message: "Invalid session. Please login again." }],
      };
    }

    const data = await res.json();
    return data;
  });
});
