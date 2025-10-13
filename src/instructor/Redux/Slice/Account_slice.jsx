// src/redux/slices/emiSummarySlice.js
import { createSlice } from "@reduxjs/toolkit";
import {  downloadEmiExcel, EmiBreakdownByDate, fetchEmiSummary, getUpcomingEmis, updateEmiPayment } from "../Api/Accounts_api";


const emiSummarySlice = createSlice({
  name: "emi",
  initialState: {
    loading: false,
    breakdown: null,
    // data: null,
    error: null,
    data: [],
    meta: {},
    paymentData: null,
    // loading: false,
    // error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmiSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmiSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmiSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(EmiBreakdownByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(EmiBreakdownByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.breakdown = action.payload;
      })
      .addCase(EmiBreakdownByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(getUpcomingEmis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUpcomingEmis.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(getUpcomingEmis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


   
      .addCase(downloadEmiExcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadEmiExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadEmiExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to export EMI Excel";
      });


      builder
      .addCase(updateEmiPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmiPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
      })
      .addCase(updateEmiPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });



  },
});

export default emiSummarySlice.reducer;
