import { createSlice } from "@reduxjs/toolkit";
import { fetchEmployeeSalary } from "../Api/Salary";



const employeSalarySlice = createSlice({
  name: "salary",
  initialState: {
    data: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeSalary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployeeSalary.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default employeSalarySlice.reducer;
