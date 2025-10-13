import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories } from "../Api/Category";



const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
   
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
    
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
