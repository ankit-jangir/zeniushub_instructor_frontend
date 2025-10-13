import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const logoutEmployee = createAsyncThunk(
  "Employee/logout",
  async (token, { rejectWithValue }) => {

    try {
      const response = await fetch(`${BASE_URL}/api/v1/instructor/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json(); // ✅ Yeh add karo

      if (!response.ok) {
        // Return entire error object to the rejected action
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      console.error("Logout error:", error); // Log the error for debugging
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);
