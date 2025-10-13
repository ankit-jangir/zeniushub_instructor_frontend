import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAssignBatchSubject,
  fetchBatchDetails,
  fetchBatchesByCourseId, // <-- updated to use the correct thunk
  fetchBatchesBySession,
  fetchCourseById,
  getSession,
  promoteStudents,
} from "../Api/Batch_Api";

const initialState = {
  batches: null,
  selectedSession: 13,
  loading: false,
  error: null,
  batchDetails: null,
  courseDetails: null,
  newBatch: null,
  mySession: {},
  promotionLoading: false,
  promotionSuccess: null,
  promotionError: null,
   empCourse: null,
    loadingEmp: false,
};

const BatchSlice = createSlice({
  name: "Batch",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.selectedSession = action.payload;
    },
    clearSession: (state) => {
      state.selectedSession = null;
    },
    clearCourseDetails: (state) => {
      state.courseDetails = null;
      state.error = null;
    },
    clearPromotionState: (state) => {
      state.promotionLoading = false;
      state.promotionSuccess = null;
      state.promotionError = null;
    },
  },
  extraReducers: (builder) => {
    // Batches by Session
    builder
      .addCase(fetchBatchesBySession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchesBySession.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload;
      })
      .addCase(fetchBatchesBySession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch batches by session";
      });

    // Batch Details
    builder
      .addCase(fetchBatchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.batchDetails = action.payload;
      })
      .addCase(fetchBatchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch batch details";
      });

    // Batches by Course ID
    builder
      .addCase(fetchBatchesByCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.newBatch = null;
      })
      .addCase(fetchBatchesByCourseId.fulfilled, (state, action) => {
        state.loading = false;
        state.newBatch = action.payload;
      })
      .addCase(fetchBatchesByCourseId.rejected, (state, action) => {
        state.loading = false;
        state.newBatch = null;
        state.error = action.payload || "Failed to fetch batches by course ID";
      });

    // Course by ID
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.courseDetails = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch course by ID";
      });

    builder
      .addCase(getSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.loading = false;
        state.mySession = action.payload;
      })
      .addCase(getSession.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(promoteStudents.pending, (state) => {
        state.promotionLoading = true;
        state.promotionSuccess = null;
        state.promotionError = null;
      })
      .addCase(promoteStudents.fulfilled, (state, action) => {
        state.promotionLoading = false;
        state.promotionSuccess = action.payload;
      })
      .addCase(promoteStudents.rejected, (state, action) => {
        state.promotionLoading = false;
        state.promotionError = action.payload || "Failed to promote students";
      });

       builder
      .addCase(fetchAssignBatchSubject.pending, (state) => {
        state.loadingEmp = true;
     
      })
      .addCase(fetchAssignBatchSubject.fulfilled, (state, action) => {
        state.loadingEmp = false;
        state.empCourse = action.payload;
      })
      .addCase(fetchAssignBatchSubject.rejected, (state, action) => {
        state.loadingEmp = false;
      
      });
  },
});

export const {
  setSession,
  clearSession,
  clearCourseDetails,
  clearPromotionState,
} = BatchSlice.actions;
export default BatchSlice.reducer;
