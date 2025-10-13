import { createSlice } from "@reduxjs/toolkit";
import { CheckToken } from "../Api/pingApi";

const initialState = {
  Token: null,
  loading: false,
  error: null,
  success: false,
};

const CheckTokenSlice = createSlice({
  name: "CheckToken",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CheckToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(CheckToken.fulfilled, (state, action) => {
        state.loading = false;
        state.Token = action.payload;
        state.success = action.payload?.success;
      })
      .addCase(CheckToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error";
        state.success = false;
      });
  },
});

export default CheckTokenSlice.reducer;
