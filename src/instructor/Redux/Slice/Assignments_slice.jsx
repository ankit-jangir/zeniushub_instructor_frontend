import { createSlice } from "@reduxjs/toolkit";
import { addAssignment, declareResults, fetchAssignmentsByBatch, fetchAssignmentsHistory, fetchAssignmentsUpcoming, fetchBatchByAssignmentId, fetchStudentResultAssignmentDetails, getResultByBatchAssignmentId } from "../Api/Assignments_api";



const assignmentSlice = createSlice({
  name: "assignments",
  initialState: {
    assignmentsHistory: [],
    totalHistory: 0,
    loadingHistory: false,
    assignmentsUpcoming: [],
    totalUpcoming: 0,
    loadingUpcoming: false,
    loadingAdd: false,
    batches: [],
    loadingBatch: false,
    loadingResult: false,
    results: [],
    loadingDeclare: false,
    result_dec_percentage: null,
    stu_Profile_loading: false,
    student_data: [],
    totalPagesStu: 0,
    currentPageStu: 1,
    countStu: {},
    totalRecordsStu: 0,
    assignmentsBatch: [],
    loadingBatch: false,
    pageAss: 1,
    limitAss: 6,
    totalAss: 0,
    totalPagesAss: 0
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignmentsHistory.pending, (state) => {
        state.loadingHistory = true;
      })
      .addCase(fetchAssignmentsHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.assignmentsHistory = action.payload?.assignments?.data || [];
        state.totalHistory = action.payload?.assignments?.total || 0;
        state.result_dec_percentage = action?.payload?.assignments?.result_dec_percentage || 0;
      })
      .addCase(fetchAssignmentsHistory.rejected, (state) => {
        state.loadingHistory = false;
      });
    builder
      .addCase(fetchAssignmentsUpcoming.pending, (state) => {
        state.loadingUpcoming = true;
      })
      .addCase(fetchAssignmentsUpcoming.fulfilled, (state, action) => {
        state.loadingUpcoming = false;
        state.assignmentsUpcoming = action.payload?.assignments?.data || [];
        state.totalUpcoming = action.payload?.assignments?.total || 0;
        state.result_dec_percentage = action?.payload?.assignments?.result_dec_percentage || 0;
      })
      .addCase(fetchAssignmentsUpcoming.rejected, (state) => {
        state.loadingUpcoming = false;
      });

    builder
      .addCase(addAssignment.pending, (state) => {
        state.loadingAdd = true;
      })
      .addCase(addAssignment.fulfilled, (state) => {
        state.loadingAdd = false;
      })
      .addCase(addAssignment.rejected, (state) => {
        state.loadingAdd = false;
      });
    builder
      .addCase(fetchBatchByAssignmentId.pending, (state) => {
        state.loadingBatch = true;
      })
      .addCase(fetchBatchByAssignmentId.fulfilled, (state, action) => {
        state.loadingBatch = false;
        state.batches = action.payload?.batches || [];
      })
      .addCase(fetchBatchByAssignmentId.rejected, (state) => {
        state.loadingBatch = false;
      });
    builder
      .addCase(getResultByBatchAssignmentId.pending, (state) => {
        state.loadingResult = true;
      })
      .addCase(getResultByBatchAssignmentId.fulfilled, (state, action) => {
        state.loadingResult = false;
        state.results = action.payload.results || [];
      })
      .addCase(getResultByBatchAssignmentId.rejected, (state) => {
        state.loadingResult = false;
      });
    builder
      .addCase(declareResults.pending, (state) => {
        state.loadingDeclare = true;
      })
      .addCase(declareResults.fulfilled, (state) => {
        state.loadingDeclare = false;
      })
      .addCase(declareResults.rejected, (state) => {
        state.loadingDeclare = false;
      });
    builder
      .addCase(fetchStudentResultAssignmentDetails.pending, (state) => {
        state.stu_Profile_loading = true;

      })
      .addCase(fetchStudentResultAssignmentDetails.fulfilled, (state, action) => {
        state.stu_Profile_loading = false;
        state.student_data = action.payload.studentDetails || {};
        state.totalPagesStu = action.payload.studentDetails?.pagination?.totalPages || 0;
        state.countStu = action.payload.studentDetails?.counts ;
        state.totalRecordsStu = action.payload.studentDetails?.pagination?.totalRecords || 0;
        state.currentPageStu = action.payload.studentDetails?.pagination?.currentPage || 1;
      })

      .addCase(fetchStudentResultAssignmentDetails.rejected, (state) => {
        state.stu_Profile_loading = false;
      });
    builder
      .addCase(fetchAssignmentsByBatch.pending, (state) => {
        state.loadingBatch = true;

      })
      .addCase(fetchAssignmentsByBatch.fulfilled, (state, action) => {
        state.loadingBatch = false;
        state.assignmentsBatch = action.payload.data.assignments;

        state.pageAss = action.payload.data.pagination.page;
        state.limitAss = action.payload.data.pagination.limit;
        state.totalAss = action.payload.data.pagination.total;
        state.totalPagesAss = action.payload.data.pagination.totalPages;
      })

      .addCase(fetchAssignmentsByBatch.rejected, (state, action) => {
        state.loadingBatch = false;
      });
  },
});

export default assignmentSlice.reducer;
