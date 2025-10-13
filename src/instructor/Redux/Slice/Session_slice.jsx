import { createSlice } from "@reduxjs/toolkit";
import { fetchSessions } from "../Api/Session_api";

const initialState = {
  Session: [],
  selectedSession: 13,
  loading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.selectedSession = action.payload;
    },
    clearSession: (state) => {
      state.selectedSession = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.Session = action.payload.sessions || [];
        // Avoid logging inside reducers — do it in thunk or component
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
