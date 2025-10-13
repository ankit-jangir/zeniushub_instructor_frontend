import { createSlice } from "@reduxjs/toolkit";
import {
  addExam,
  deleteExam,
  fetchBatchDetailsById,
  fetchexam,
  fetchExamHistory,

  fetchExamsByBatchId,
  fetchExamss,
  fetchStudentExamDetails,
  saveExamResult,
} from "../Api/Exam_api";

const examSlice = createSlice({
  name: "exams",
  initialState: {
    exam: [],
    batchDetails: [],

    history: {
      data: [],
      totalRecords: 0,
      totalPagesExam: 0,
      currentPage: 1,
    },
    loading: false,
    error: null,

    examsBatch: [],
    loadingBatchExam: false,
    pagination: {
      page: 1,
      limit: 6,
      totalPages: 0,
      totalRecords: 0,
    },
    Exams: [],
    loadingE: false,


    resultData: null,
    loadingR: false,
    loadingS: false,

    examDetails: [],
    totalP: 0,
    curntP: 1,
    stuDetails: {},
    totalR: 0,
    counts: {}
  },
  reducers: {
    setPageExam: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all exam
    builder
      .addCase(fetchexam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchexam.fulfilled, (state, action) => {
        state.loading = false;
        state.exam = action.payload;
      })
      .addCase(fetchexam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.exam = {};
      });

    // add exam
    builder
      .addCase(addExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExam.fulfilled, (state, action) => {
        state.loading = false;
        // state.exam = action.payload;
      })
      .addCase(addExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // get exam history
    builder
      .addCase(fetchExamHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.history = {
          data: [],
          totalRecords: 0,
          totalPages: 0,
          currentPage: 1,
        }; // ✅ clear old data when new search starts
      })
      .addCase(fetchExamHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchExamHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.history = {
          data: [],
          totalRecords: 0,
          totalPages: 0,
          currentPage: 1,
        };
      });

    //  get data by id schedule exam data
    builder
      .addCase(fetchBatchDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.batchDetails = action.payload;
      })
      .addCase(fetchBatchDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // delete api 
    builder
      .addCase(deleteExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.loading = false;
        state.exam.data = state.exam.data.filter((exam) => exam.id !== action.payload.id);


      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });

    builder
      .addCase(fetchExamss.pending, (state) => {
        state.loadingBatchExam = true;
      })
      .addCase(fetchExamss.fulfilled, (state, action) => {
        state.loadingBatchExam = false;
        state.examsBatch = action.payload?.data?.exams || [];
        state.pagination = {
          ...state.pagination,
          totalPagesExam: action.payload?.data?.pagination?.totalPages || 0,
          totalRecords: action.payload?.data?.pagination?.totalRecords || 0,
          page: action.payload?.data?.pagination?.currentPage || 1,
        };
      })
      .addCase(fetchExamss.rejected, (state) => {
        state.loadingBatchExam = false;
      });

    builder
      .addCase(fetchExamsByBatchId.pending, (state) => {
        state.loadingE = true;

      })
      .addCase(fetchExamsByBatchId.fulfilled, (state, action) => {
        state.loadingE = false;
        state.Exams = action.payload;
      })
      .addCase(fetchExamsByBatchId.rejected, (state, action) => {
        state.loadingE = false;
      });

    builder
      .addCase(saveExamResult.pending, (state) => {
        state.loadingR = true;

      })
      .addCase(saveExamResult.fulfilled, (state, action) => {
        state.loadingR = false;
        state.resultData = action.payload;
      })
      .addCase(saveExamResult.rejected, (state) => {
        state.loadingR = false;
      });

    builder
      .addCase(fetchStudentExamDetails.pending, (state) => {
        state.loadingS = true;

      })
      .addCase(fetchStudentExamDetails.fulfilled, (state, action) => {
        state.loadingS = false;
        state.examDetails = action.payload.studentDetails.results;
        state.stuDetails = action.payload.studentDetails.student;
        state.counts = action.payload.studentDetails.counts || {};
        state.curntP = action.payload.studentDetails.pagination.currentPage || 1;
        state.totalP = action.payload.studentDetails.pagination.totalPages || 0;
        state.totalR = action.payload.studentDetails.pagination.totalRecords || 0;
      })
      .addCase(fetchStudentExamDetails.rejected, (state) => {
        state.loadingS = false;
      });
  },
});

export const { setPageExam } = examSlice.actions;
export default examSlice.reducer;
