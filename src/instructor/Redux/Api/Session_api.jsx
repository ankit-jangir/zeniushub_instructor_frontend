import { createAsyncThunk } from "@reduxjs/toolkit";
// let token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_BASE_URL;

//Fetch_Session
export const fetchSessions = createAsyncThunk(
  "session/fetch",
  async (token, { rejectWithValue }) => {
    try {
      const responce = await fetch(`${BASE_URL}/api/v1/session/fetch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!responce.ok) {
        const errordata = await responce.json();
        return rejectWithValue(errordata.message || "Failed to fetch sessions");
      }

      const result = await responce.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);